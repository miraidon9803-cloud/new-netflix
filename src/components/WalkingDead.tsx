import React from 'react';
import './scss/Wakingdead.scss';

const WalkingDeadList = [
  '/images/워킹데드/메인.png',
  '/images/워킹데드/시즌1.png',
  '/images/워킹데드/시즌2.png',
  '/images/워킹데드/시즌3.png',
  '/images/워킹데드/시즌4.png',
  '/images/워킹데드/시즌5.png',
  '/images/워킹데드/시즌6.png',
  '/images/워킹데드/시즌7.png',
  '/images/워킹데드/시즌8.png',
  '/images/워킹데드/시즌9.png',
  '/images/워킹데드/시즌10.png',
  '/images/워킹데드/시즌11.png',
];

const WalkingDead = () => {
  return (
    <div className="walking">
      <p>워킹데드 몰아보기</p>
      <ul>
        {WalkingDeadList.map((src, i) => (
          <li key={i}>
            {i === 0 && (
              <>
                <button>
                  <img src="/images/icon/play.png" alt="play" />
                  재생
                </button>
              </>
            )}
            <img src={src} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalkingDead;
