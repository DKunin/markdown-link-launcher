/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Markdown File Path - Full path to your markdown file or directory */
  "markdownFilePath": string,
  /** Search Recursively - Search through subdirectories when a folder path is provided */
  "searchRecursive": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `open-markdown-links` command */
  export type OpenMarkdownLinks = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `open-markdown-links` command */
  export type OpenMarkdownLinks = {}
}

