import { useState } from 'react';
import './scss/AppPopup.scss';  // 스타일을 추가하세요

const AppPopup = ({ onClose }) => {
    const [autoPlay, setAutoPlay] = useState(false);
    const [saveContent, setSaveContent] = useState(false);
    const [wifiOnly, setWifiOnly] = useState(false);
    const [quality, setQuality] = useState("고화질");

    const handleClose = () => {
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

                    <form>
                        <div className="setting-wrap">
                            <div className="setting-group">
                                <p className='auto-title'>자동재생 설정</p>
                                <div className="toggle-group">
                                    <div className="toggle-option">
                                        <label>다음 화 자동 재생</label>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${autoPlay ? 'on' : 'off'}`}
                                            onClick={() => setAutoPlay(!autoPlay)}
                                        >
                                            <span className="toggle-knob" />
                                        </button>
                                    </div>
                                    <div className="toggle-option">
                                        <label>미리보기 자동 재생</label>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${saveContent ? 'on' : 'off'}`}
                                            onClick={() => setSaveContent(!saveContent)}
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
                                            className={`toggle-btn ${wifiOnly ? 'on' : 'off'}`}
                                            onClick={() => setWifiOnly(!wifiOnly)}
                                        >
                                            <span className="toggle-knob" />
                                        </button>
                                    </div>
                                </div>

                                <p>영상 화질</p>
                                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
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
