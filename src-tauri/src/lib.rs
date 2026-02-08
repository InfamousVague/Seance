//! Séance Desktop Application
//!
//! Minimal Tauri backend. Rust commands for file system
//! operations and settings will be added in a later phase.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running Séance");
}
