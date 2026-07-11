// ──────────────────────────────────────────────
// Tauri IPC Commands
// ──────────────────────────────────────────────

use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

/// Show the native floating window (always-on-top, small, borderless)
#[tauri::command]
pub async fn show_floating_window(app: AppHandle) -> Result<(), String> {
    // Check if floating window already exists
    if app.get_webview_window("floating").is_some() {
        let win = app.get_webview_window("floating").unwrap();
        win.show().map_err(|e| e.to_string())?;
        return Ok(());
    }

    // Create a small borderless always-on-top window
    let _floating = WebviewWindowBuilder::new(
        &app,
        "floating",
        WebviewUrl::App("floating.html".into()),
    )
    .title("ZenTimer Floating")
    .inner_size(160.0, 80.0)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .resizable(false)
    .transparent(true)
    .center()
    .build()
    .map_err(|e| e.to_string())?;

    Ok(())
}

/// Hide the floating window
#[tauri::command]
pub async fn hide_floating_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        window.hide().map_err(|e| e.to_string())?;
    }
    // Notify the main window so its toggle button reflects the closed state
    let _ = app.emit("floating-closed", ());
    Ok(())
}

/// Close (hide) the floating window — called from floating window JS
#[tauri::command]
pub async fn close_floating_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        window.hide().map_err(|e| e.to_string())?;
    }
    // Notify the main window so its toggle button reflects the closed state
    let _ = app.emit("floating-closed", ());
    Ok(())
}

/// Start dragging the floating window — called from floating window JS
#[tauri::command]
pub async fn drag_floating_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        window.start_dragging().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Update the floating window's timer display
/// Uses window.eval() to directly inject JS — no event system needed
#[tauri::command]
pub async fn update_floating_timer(
    app: AppHandle,
    time: String,
    phase: String,
    progress: f64,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        let payload = serde_json::json!({
            "time": time,
            "phase": phase,
            "progress": progress,
        });
        let js = format!(
            "window.updateDisplay({})",
            serde_json::to_string(&payload).map_err(|e| e.to_string())?
        );
        window.eval(&js).map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Toggle (pause/resume) the timer when the floating window is single-tapped.
/// The timer state lives in the frontend, so we emit an event to the main
/// window which performs the actual toggle.
#[tauri::command]
pub async fn floating_toggle_timer(app: AppHandle) -> Result<(), String> {
    app.emit("floating-toggle", ())
        .map_err(|e| e.to_string())?;
    Ok(())
}

/// Set the floating window opacity (0.0–1.0 from slider).
///
/// Two-layer opacity system:
///   Layer 1 — Win32 window alpha (base visibility floor):
///     slider 0% → 15%, slider 100% → 100%
///     This ensures text is always at least somewhat visible.
///
///   Layer 2 — CSS per-element opacity (set via JS in floating.html):
///     Container shape fades more aggressively (ghostly at 0%).
///     Text stays brighter than the frame by ~8-12 percentage points,
///     so digits are always the most legible element.
#[tauri::command]
pub async fn set_floating_opacity(app: AppHandle, opacity: f64) -> Result<(), String> {
    let raw = opacity.clamp(0.0, 1.0);

    // ── Layer 1: Win32 window alpha ──
    // Map [0, 1] → [0.15, 1.0]: even at "0%" the window retains
    // enough alpha that white text (~90% CSS opacity) reads as ~13-14%
    // effective brightness — in the user's desired 10-15% range.
    let window_alpha = 0.15 + raw * 0.85;

    #[cfg(windows)]
    {
        if let Some(window) = app.get_webview_window("floating") {
            if let Ok(hwnd) = window.hwnd() {
                use windows::Win32::Foundation::COLORREF;
                use windows::Win32::UI::WindowsAndMessaging::{
                    GetWindowLongPtrW, SetLayeredWindowAttributes, SetWindowLongPtrW,
                    GWL_EXSTYLE, LWA_ALPHA, WS_EX_LAYERED,
                };
                unsafe {
                    let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
                    if ex & (WS_EX_LAYERED.0 as isize) == 0 {
                        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex | WS_EX_LAYERED.0 as isize);
                    }
                    let _ = SetLayeredWindowAttributes(
                        hwnd,
                        COLORREF(0),
                        (window_alpha * 255.0).round() as u8,
                        LWA_ALPHA,
                    );
                }
            }

            // ── Layer 2: Tell the HTML to adjust internal CSS opacities ──
            // The JS function setOpacityLevel() will:
            //   - Fade container background/border/shadow more than the window
            //   - Keep text opacity always 8-12 pts ahead of the shape
            let js = format!("if(window.setOpacityLevel)window.setOpacityLevel({})", raw);
            let _ = window.eval(&js);
        }
    }
    #[cfg(not(windows))]
    {
        // Non-Windows targets: no-op (floating window is Windows-only for now)
        let _ = (&app, clamped);
    }
    Ok(())
}

/// Bring the main window to the front when the floating window is double-tapped.
#[tauri::command]
pub async fn floating_show_main(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Lock or unlock the floating window's interactivity.
/// When locked: pointer-events disabled, cannot drag/click/tap.
/// Unlock must be done from the main app settings panel.
#[tauri::command]
pub async fn set_floating_locked(app: AppHandle, locked: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        // Tell the HTML to toggle its locked state (CSS + interaction guards)
        let js = format!("if(window.setLockedState)window.setLockedState({})", locked);
        window.eval(&js).map_err(|e| e.to_string())?;
    }
    Ok(())
}
