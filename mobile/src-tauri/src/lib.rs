//! Shell for the Actin member app on iOS and Android (desktop builds are for
//! development only). The UI is the Nuxt SPA in the folder above; it talks to
//! actin_pwa_backend over HTTPS itself, so Rust only hosts the webview, keeps it
//! on the app's own pages and, on phones, adds the camera QR reader.

use tauri::{WebviewUrl, WebviewWindowBuilder};

/// Only the app's own pages may load in the webview; any other link is dropped.
fn allowed_navigation(url: &tauri::Url) -> bool {
    match url.scheme() {
        "tauri" | "asset" | "about" | "data" | "blob" => true,
        "http" | "https" => matches!(
            url.host_str(),
            Some("tauri.localhost" | "localhost" | "127.0.0.1" | "ipc.localhost")
        ) || is_dev_server(url),
        _ => false,
    }
}

/// `tauri android dev` / `tauri ios dev` serve the UI from the computer's LAN address.
fn is_dev_server(url: &tauri::Url) -> bool {
    cfg!(debug_assertions)
        && matches!(
            (std::env::var("TAURI_DEV_HOST").ok(), url.host_str()),
            (Some(dev), Some(host)) if dev == host
        )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    #[cfg(mobile)]
    let builder = builder.plugin(tauri_plugin_barcode_scanner::init());

    builder
        .setup(|app| {
            let window = WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
                .on_navigation(|url| allowed_navigation(url));
            // Phones are always full screen; on desktop show a phone-sized window.
            #[cfg(desktop)]
            let window = window.title("Actin").inner_size(400.0, 820.0).min_inner_size(360.0, 640.0);
            window.build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running the Actin app");
}

#[cfg(test)]
mod tests {
    use super::allowed_navigation;

    #[test]
    fn keeps_the_webview_on_app_pages() {
        let ok = ["tauri://localhost/results", "http://tauri.localhost/claim", "http://localhost:3000/"];
        for u in ok {
            assert!(allowed_navigation(&u.parse().unwrap()), "{u}");
        }
        let blocked = ["https://example.com/", "https://api.actinhealth.ir/docs", "file:///etc/passwd", "intent://scan"];
        for u in blocked {
            assert!(!allowed_navigation(&u.parse().unwrap()), "{u}");
        }
    }
}
