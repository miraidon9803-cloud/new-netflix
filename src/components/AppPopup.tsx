import { useEffect, useState } from "react";
import "./scss/AppPopup.scss";

const STORAGE_KEY = "app-settings";

const AppPopup = ({ onClose }) => {
  const [autoPlay, setAutoPlay] = useState(false);
  const [saveContent, setSaveContent] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [quality, setQuality] = useState("고화질");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      setAutoPlay(!!saved.autoPlay);
      setSaveContent(!!saved.saveContent);
      setWifiOnly(!!saved.wifiOnly);
      setQuality(saved.quality ?? "고화질");
    } catch (e) {
      console.error("앱 설정 불러오기 실패:", e);
    }
  }, []);

  const handleClose = () => onClose();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { autoPlay, saveContent, wifiOnly, quality };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    alert("앱 설정이 저장되었습니다.");
    onClose();
  };

  return (
    <div className="app-inner">
      <div className="app-wrap">
        <div className="app-content">
          <div className="app-header">
            <h1>앱 설정</h1>
            <button onClick={handleClose} className="close">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="setting-wrap">
              <div className="setting-group">
                <p className="auto-title">자동재생 설정</p>

                <div className="toggle-group">
                  <div className="toggle-option">
                    <label>다음 화 자동 재생</label>
                    <button
                      type="button"
                      className={`toggle-btn ${autoPlay ? "on" : "off"}`}
                      onClick={() => setAutoPlay((v) => !v)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>

                  <div className="toggle-option">
                    <label>미리보기 자동 재생</label>
                    <button
                      type="button"
                      className={`toggle-btn ${saveContent ? "on" : "off"}`}
                      onClick={() => setSaveContent((v) => !v)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                </div>

                <p>콘텐츠 저장 설정</p>
                <div className="toggle-group">
                  <div className="toggle-option">
                    <label>Wi-Fi만 사용</label>
                    <button
                      type="button"
                      className={`toggle-btn ${wifiOnly ? "on" : "off"}`}
                      onClick={() => setWifiOnly((v) => !v)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                </div>

                <p>영상 화질</p>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                >
                  <option value="고화질">고화질</option>
                  <option value="일반화질">일반화질</option>
                </select>
              </div>

              <button type="submit" className="save-btn">
                저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppPopup;
