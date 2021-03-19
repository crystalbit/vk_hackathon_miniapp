import React from 'react';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Unknown from '../img/unknown.png';
import Paper1 from '../img/paper1.png';
import Stone1 from '../img/stone1.png';
import Knife1 from '../img/knife1.png';
import Paper2 from '../img/paper2.png';
import Stone2 from '../img/stone2.png';
import Knife2 from '../img/knife2.png';
import Paper3 from '../img/paper3.png';
import Stone3 from '../img/stone3.png';
import Knife3 from '../img/knife3.png';

export const StickerStates = {
  UNKNOWN: -1,
  KNIFE: 0,
  PAPER: 1,
  STONE: 2,
};

const oneOf = (elements) => {
  return elements[Math.floor(elements.length * Math.random())];
}

const Sticker = ({ element, changeSticker, index }) => {
  const image = React.useMemo(() => {
    let image = Unknown;
    if (element === StickerStates.PAPER) {
      image = oneOf([
        Paper1,
        Paper2,
        Paper3,
      ]);
    }
    if (element === StickerStates.STONE) {
      image = oneOf([
        Stone1,
        Stone2,
        Stone3,
      ]);
    }
    if (element === StickerStates.KNIFE) {
      image = oneOf([
        Knife1,
        Knife2,
        Knife3,
      ]);
    }
    return image;
  }, [element]);

  return <img
    style={{
      width: '20%',
      cursor: changeSticker ? 'pointer' : 'unset',
    }}
    src={image}
    onClick={() => changeSticker?.(index)}
  />;
};

export const ThreeStickers = ({ element1, element2, element3, changeSticker }) => {
  return <Div style={{ textAlign: 'center' }}>
    <Sticker element={element1} index={0} key={0} changeSticker={changeSticker} />
    <Sticker element={element2} index={1} key={1} changeSticker={changeSticker} />
    <Sticker element={element3} index={2} key={2} changeSticker={changeSticker} />
  </Div>;
};