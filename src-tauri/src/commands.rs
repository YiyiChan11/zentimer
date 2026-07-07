// ──────────────────────────────────────────────
// Tauri IPC Commands
// ──────────────────────────────────────────────

use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

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
    .transparent(false)
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
    Ok(())
}

/// Close (hide) the floating window — called from floating window JS
#[tauri::command]
pub async fn close_floating_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("floating") {
        window.hide().map_err(|e| e.to_string())?;
    }
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
