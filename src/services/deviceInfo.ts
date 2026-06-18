/**
 * 收集瀏覽器裝置資訊(對應 Flutter DeviceInfoService 的 web 分支)。
 * 用於 app_opened 事件的參數。
 */
export function getDeviceInfo(): Record<string, string> {
  try {
    const nav = navigator;
    return {
      platform: 'web',
      user_agent: nav.userAgent ?? 'unknown',
      vendor: nav.vendor || 'unknown',
      language: nav.language ?? 'unknown',
      platform_type: nav.platform ?? 'unknown',
    };
  } catch (e) {
    return { platform: 'web', error: String(e) };
  }
}
