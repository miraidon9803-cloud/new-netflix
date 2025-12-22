import { useState, type FormEvent } from "react";
import "./scss/AppPopup.scss";

const STORAGE_KEY = "app-settings";

interface AppPopupProps {
  onClose: () => void;
}

type AppSettings = {
  autoPlay: boolean;
  saveContent: boolean;
  wifiOnly: boolean;
  quality: string;
};

const getInitialSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        autoPlay: false,
        saveContent: false,
        wifiOnly: false,
        quality: "고화질",
      };
    }

    const saved = JSON.parse(raw) as Partial<AppSettings>;

    return {
      autoPlay: !!saved.autoPlay,
      saveContent: !!saved.saveContent,
      wifiOnly: !!saved.wifiOnly,
      quality: saved.quality ?? "고화질",
    };
  } catch (e) {
    console.error("앱 설정 불러오기 실패:", e);
    return {
      autoPlay: false,
      saveContent: false,
      wifiOnly: false,
      quality: "고화질",
    };
  }
};

const AppPopup = ({ onClose }: AppPopupProps) => {
  // ✅ 최초 렌더에서 한 번만 localStorage 읽어서 초기값 세팅
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);

  const [open, setOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    alert("앱 설정이 저장되었습니다.");
    onClose();
  };

  return (
    <div className="app-inner">
      <div className="app-dim" onClick={onClose} />
      <div className="app-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="app-content">
          <div className="app-header">
            <div className="app-header-inner">
              <h1 className="apppop-title">앱 설정</h1>
              <button className="close-btn" onClick={onClose} type="button">
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
                        className={`toggle-btn ${
                          settings.autoPlay ? "on" : "off"
                        }`}
                        onClick={() =>
                          setSettings((p) => ({ ...p, autoPlay: !p.autoPlay }))
                        }
                      >
                        <span className="toggle-knob" />
                      </button>
                    </div>

                    <div className="toggle-option">
                      <label>미리보기 자동 재생</label>
                      <button
                        type="button"
                        className={`toggle-btn ${
                          settings.saveContent ? "on" : "off"
                        }`}
                        onClick={() =>
                          setSettings((p) => ({
                            ...p,
                            saveContent: !p.saveContent,
                          }))
                        }
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
                        className={`toggle-btn ${
                          settings.wifiOnly ? "on" : "off"
                        }`}
                        onClick={() =>
                          setSettings((p) => ({ ...p, wifiOnly: !p.wifiOnly }))
                        }
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
                        {settings.quality}
                        <span className={`arrow ${open ? "open" : ""}`} />
                      </button>

                      {open && (
                        <ul className="quality-options">
                          <li
                            onClick={() => {
                              setSettings((p) => ({ ...p, quality: "고화질" }));
                              setOpen(false);
                            }}
                          >
                            고화질
                          </li>
                          <li
                            onClick={() => {
                              setSettings((p) => ({
                                ...p,
                                quality: "일반화질",
                              }));
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
