---
name: Bảo Trung Portfolio
description: A project-led portfolio for .NET full-stack internships.
colors:
  plum: "#211824"
  paper: "#f8f6fa"
  soft: "#eee7f0"
  muted: "#5d5161"
  on-plum: "#fff9ff"
  on-plum-muted: "#d6c9d8"
  accent: "#e9fa9c"
  line: "#d8cfdc"
  plum-line: "#5c4a5f"
  focus: "#8041a2"
typography:
  display:
    fontFamily: "Bricolage, system-ui, sans-serif"
    fontWeight: 750
    lineHeight: 1.04
    letterSpacing: "-0.028em"
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
rounded:
  action: "0.5rem"
  image: "0.75rem"
  feature: "1rem"
components:
  primary-action:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.plum}"
    rounded: "{rounded.action}"
    padding: "0.7rem 1.125rem"
  featured-project:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.plum}"
    rounded: "{rounded.feature}"
---

## Overview

The name and portrait introduce the developer. Project screenshots and contribution links show how he works. The layout uses section color and scale to move from introduction to evidence to contact.

## Colors

Plum anchors the introduction and contact. Paper holds the project list and soft lilac groups the featured project and biography. Lime highlights the main action on plum.

## Typography

Use the self-hosted Bricolage Grotesque for headings, including names with Vietnamese diacritics. Use system type for copy and controls.

## Layout

The content column caps at 74rem. TeamPulse uses a full-width feature with one screenshot and a disclosure for pull requests. The other selected projects form a pair on wide screens and stack on phones. Supporting work uses rows.

## Components

Use filled buttons for the main action and underlined links for source, release, and demo links. Caption product screenshots when they show sample data. Preserve keyboard focus on all links and the native disclosure.
