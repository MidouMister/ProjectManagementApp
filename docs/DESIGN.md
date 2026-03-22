# Design System Strategy: High-Density Precision

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Monolith."** 

Modern enterprise software often falls into the trap of "cheerful clutter." This system rejects that, instead leaning into a sophisticated, high-density editorial aesthetic inspired by Swiss typography and precision engineering. We are building a workspace that feels like a physical architect's desk: clean, high-contrast, and deeply layered. 

By utilizing **Inter** for its neutral, functional clarity and pairing it with a strictly enforced tonal hierarchy, we move beyond generic project management tools. We break the "template" look through intentional density—allowing more information on screen without sacrificing the premium, "breathable" feel of a luxury digital experience.

---

## 2. Colors & Surface Philosophy

The palette is anchored by the authoritative **#1E3A8A (Navy)**, used with surgical precision to denote action and priority against a clinical, multi-tiered neutral canvas.

### The "No-Line" Rule
To achieve a premium "Editorial" look, 1px solid borders for sectioning are strictly prohibited. The UI must be carved out of the background using background color shifts. 
- Use `surface_container_low` (#f3f4f6) to define the main sidebar or navigation.
- Use `surface` (#f8f9fb) for the primary workspace.
- When an element needs to "pop" (like a Kanban card), use `surface_container_lowest` (#ffffff).

### Surface Hierarchy & Nesting
Depth is achieved through a "Stack of Paper" mental model. 
- **Base Layer:** `background` (#f8f9fb).
- **Secondary Containers:** `surface_container` (#edeef0) for grouping related tools.
- **Top-Level Content:** `surface_container_lowest` (#ffffff) for the actual data points.

### The "Glass & Signature" Texture
To prevent the UI from feeling "flat" or "sterile," use Glassmorphism for floating menus and modals.
- **Glass Token:** Use `surface` at 80% opacity with a `20px` backdrop blur.
- **Signature Gradient:** For primary CTAs (like "Create Project"), use a subtle vertical gradient from `primary_container` (#1E3A8A) to `primary` (#00236f). This provides a "jewel-like" depth that flat buttons lack.

---

## 3. Typography: The Inter Grid

The use of **Inter** is not just for readability; it is our primary tool for hierarchy. We use extreme scale differences to guide the eye.

| Level | Token | Size | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | 700 | -0.02em | High-impact dashboard metrics |
| **Headline** | `headline-sm` | 1.5rem | 600 | -0.01em | Page titles and Modal headers |
| **Title** | `title-sm` | 1.0rem | 500 | 0 | Section headers within cards |
| **Body** | `body-md` | 0.875rem | 400 | 0 | General task descriptions |
| **Label** | `label-sm` | 0.6875rem | 600 | +0.05em | Uppercase metadata/tags |

**Editorial Note:** Use `label-sm` in all-caps for metadata (e.g., "DUE DATE") to create a professional, architectural aesthetic that differentiates "Data" from "Content."

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are replaced by **Ambient Occlusion.** Depth should feel like natural light falling on stacked material.

*   **The Layering Principle:** Avoid `outline` tokens. Instead, place a white card (`surface_container_lowest`) on a light gray background (`surface_container_low`). The contrast *is* the border.
*   **Ambient Shadows:** For modals or floating menus, use a multi-layered shadow:
    *   `box-shadow: 0 4px 6px -1px rgba(13, 12, 34, 0.04), 0 10px 15px -3px rgba(13, 12, 34, 0.08);`
    *   Note the use of `#0D0C22` (the brand dark) as the shadow tint rather than pure black.
*   **The Ghost Border:** If a border is required for accessibility (e.g., in high-contrast mode), use `outline_variant` at 15% opacity. It should be "felt, not seen."

---

## 5. Components: The Building Blocks

### Buttons
- **Primary:** Gradient from `primary_container` to `primary`. 8px radius. Text in `on_primary`.
- **Secondary:** Surface `surface_container_high` with no border. Text in `on_surface`.
- **Tertiary:** Transparent background. Text in `primary`. Hover state uses `surface_container_low`.

### Cards (The "Kanban" Standard)
- **Styling:** No borders. Background: `surface_container_lowest` (#ffffff).
- **Shadow:** Use the 8% Ambient Shadow mentioned above.
- **Spacing:** `spacing.4` (0.9rem) internal padding to maintain high density.

### Input Fields
- **Idle:** Background `surface_container_low`, 8px radius.
- **Focus:** 1px solid `primary`. No "glow." The precision of a single line is more "enterprise-grade" than a soft outer glow.

### Project-Specific Components
- **The "Timeline Pin":** For project gantt charts, use a vertical line in `primary` with a 4px circular head to denote the "Current Date"—this creates a strong vertical anchor in a horizontal layout.
- **Status Pills:** Use low-saturation backgrounds (e.g., `tertiary_container` at 20% opacity) with high-saturation text to keep the UI from looking like "Skittles."

---

## 6. Do's and Don'ts

### Do
*   **Do** use `spacing.2` (0.4rem) for tight clusters of related metadata.
*   **Do** use "Negative Space" as a divider. If two sections feel cramped, increase the padding rather than adding a line.
*   **Do** align all text to a strict baseline. High-density design only works if the alignment is perfect.

### Don't
*   **Don't** use 100% opaque borders. They create "visual noise" that fatigues the user in a high-density environment.
*   **Don't** use a shadow on every card. If cards are sitting on a contrasting background, the shadow is redundant and adds clutter.
*   **Don't** use `primary` (#1E3A8A) for large background areas. It is an "Accent and Authority" color; keep it restricted to buttons, active states, and highlights.