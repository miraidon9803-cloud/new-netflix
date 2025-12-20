import { useEffect, useState, type FormEvent } from "react";
import "./scss/AppPopup.scss";

const STORAGE_KEY = "app-settings";

interface AppPopupProps {
  onClose: () => void;
}

const AppPopup = ({ onClose }: AppPopupProps) => {
  const [autoPlay, setAutoPlay] = useState(false);
  const [saveContent, setSaveContent] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [quality, setQuality] = useState("고화질");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw) as {
        autoPlay?: boolean;
        saveContent?: boolean;
        wifiOnly?: boolean;
        quality?: string;
      };

      setAutoPlay(!!saved.autoPlay);
      setSaveContent(!!saved.saveContent);
      setWifiOnly(!!saved.wifiOnly);
      setQuality(saved.quality ?? "고화질");
    } catch (e) {
      console.error("앱 설정 불러오기 실패:", e);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
            <div className="app-header-inner">
              <h1 className="apppop-title">앱 설정</h1>
              <button className="close-btn" onClick={onClose}>
                <img src="/images/icon/AppPopup-close.png" alt="앱 설정 닫기" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="setting-wrap">
              <div className="setting-group">
                <div className="Playback-Settings">
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
                </div>

                <div className="Content-Settings">
                  <p className="Content-title">콘텐츠 저장 설정</p>
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

                    <div
                      className="quality-group"
                      onBlur={() => setOpen(false)}
                      tabIndex={0}
                    >
                      <p className="quality-title">영상 화질</p>

                      <button
                        type="button"
                        className="quality-trigger"
                        onClick={() => setOpen((v) => !v)}
                      >
                        {quality}
                        <span className={`arrow ${open ? "open" : ""}`} />
                      </button>

                      {open && (
                        <ul className="quality-options">
                          <li
                            onClick={() => {
                              setQuality("고화질");
                              setOpen(false);
                            }}
                          >
                            고화질
                          </li>
                          <li
                            onClick={() => {
                              setQuality("일반화질");
                              setOpen(false);
                            }}
                          >
                            일반화질
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="auto-spacer" />

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
