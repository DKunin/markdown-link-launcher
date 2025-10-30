import { Action, ActionPanel, Icon, List, Toast, getPreferenceValues, showToast } from "@raycast/api";
import { existsSync, readFileSync } from "fs";
import { useEffect, useState } from "react";

import { MarkdownLink, extractMarkdownLinks } from "./utils/markdown";

interface Preferences {
  markdownFilePath: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [links, setLinks] = useState<MarkdownLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarkdownLinks();
  }, []);

  async function loadMarkdownLinks() {
    try {
      setIsLoading(true);
      setError(null);

      if (!existsSync(preferences.markdownFilePath)) {
        throw new Error(`File not found: ${preferences.markdownFilePath}`);
      }

      const fileContent = readFileSync(preferences.markdownFilePath, "utf-8");
      const extractedLinks = extractMarkdownLinks(fileContent);

      setLinks(extractedLinks);

      if (extractedLinks.length === 0) {
        await showToast({
          style: Toast.Style.Success,
          title: "No links found",
          message: "The markdown file doesn't contain any links",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error reading file",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <List isLoading={isLoading}>
        <List.EmptyView
          title="Error Loading File"
          description={error}
          icon={Icon.ExclamationMark}
          actions={
            <ActionPanel>
              <Action title="Retry" onAction={loadMarkdownLinks} icon={Icon.RotateClockwise} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search links...">
      {links.length === 0 && !isLoading ? (
        <List.EmptyView
          title="No Links Found"
          description="No markdown links were found in the specified file"
          icon={Icon.Document}
        />
      ) : (
        links.map((link, index) => (
          <List.Item
            key={`${link.url}-${index}`}
            title={link.text}
            subtitle={link.url}
            accessories={[{ text: `Line ${link.lineNumber}` }]}
            icon={Icon.Link}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={link.url} />
                <Action.CopyToClipboard
                  title="Copy URL"
                  content={link.url}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
                <Action.CopyToClipboard
                  title="Copy Link as Markdown"
                  content={`[${link.text}](${link.url})`}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                />
                <Action
                  title="Refresh Links"
                  onAction={loadMarkdownLinks}
                  icon={Icon.RotateClockwise}
                  shortcut={{ modifiers: ["cmd"], key: "r" }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
