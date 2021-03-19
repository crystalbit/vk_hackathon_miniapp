import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import './InGame.css';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import { Button, Input } from '@vkontakte/vkui';
import { apiSendAction, apiSendMessage } from '../Api';
import { GAME_NAME } from '../config';
import { StickerStates, ThreeStickers } from '../components/ThreeStickers';
import { Icon24SendOutline, Icon24Services, Icon24Switch } from '@vkontakte/icons';
import { RESULT } from '../App';

const randomSticker = () => {
	if (Math.random() < 0.333) {
		return StickerStates.KNIFE;
	}
	if (Math.random() < 0.333) {
		return StickerStates.PAPER;
	}
	return StickerStates.STONE;
};

const rotateSticker = (sticker) => {
	switch (sticker) {
		case StickerStates.STONE:
			return StickerStates.PAPER;
		case StickerStates.PAPER:
			return StickerStates.KNIFE;
		default:
			return StickerStates.STONE;
	}
}

const InGame = ({
	id,
		go,
		pairedUser,
		fetchedUser,
		messages,
		addMessage,
		enemyFinished,
		enemyCombination,
		gameResult,
	}) => {
	const [text, setText] = React.useState('');

	const [stickers, setStickers] = React.useState([StickerStates.KNIFE, StickerStates.KNIFE, StickerStates.KNIFE]);

	const [combinationSent, setCombinationSent] = React.useState(false);

	React.useEffect(() => {
		setStickers([randomSticker(), randomSticker(), randomSticker()]);
	}, []);

	const handleSend = React.useCallback((text) => {
		apiSendMessage(fetchedUser.id, text).then((res) => {
			if (res.success) {
				addMessage(text, true);
				setText('');
			}
		}).catch((error) => {
			console.log(error);
		});
	}, []);

	return <Panel id={id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={go} data-to="home" />}
		>
			{GAME_NAME}
		</PanelHeader>
		<Group header={<Header mode="secondary">Твой боец:</Header>}>
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>
		<Group header={<Header mode="secondary">Твой противник:</Header>}>
			<Cell
				before={pairedUser.photo_200 ? <Avatar src={pairedUser.photo_200}/> : null}
				description={pairedUser.city && pairedUser.city.title ? pairedUser.city.title : ''}
			>
				{`${pairedUser.first_name} ${pairedUser.last_name}`}
			</Cell>
		</Group>
		<Group header={<Header mode="secondary">Игровое пространство</Header>} style={{ textAlign: 'center' }}>
			{!enemyCombination && <ThreeStickers
				element1={StickerStates.UNKNOWN}
				element2={StickerStates.UNKNOWN}
				element3={StickerStates.UNKNOWN}
			/>}
			{enemyCombination && <ThreeStickers
				element1={enemyCombination[0]}
				element2={enemyCombination[1]}
				element3={enemyCombination[2]}
			/>}
			<Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				{!enemyFinished && !gameResult && 'Противник пока не отправил комбинацию'}
				{enemyFinished && !gameResult && 'Противник уже готов!'}
				{gameResult === RESULT.win && 'Победа!'}
				{gameResult === RESULT.lose && 'Проиграл((('}
				{gameResult === RESULT.neutral && 'Произошла ничья'}
				{gameResult !== null && <Button onClick={go} data-to="home" style={{ marginLeft: '20px' }}>
					<Icon24Switch />
				</Button>}
			</Div>
			<ThreeStickers
				element1={stickers[0]}
				element2={stickers[1]}
				element3={stickers[2]}
				changeSticker={combinationSent ? null : (index) => {
					setStickers((stickers) => {
						return stickers.map((sticker, i) => i === index ? rotateSticker(sticker) : sticker);
					});
				}}
			/>
			{!combinationSent && <Button
			  onClick={async () => {
			  	const result = await apiSendAction(fetchedUser.id, 'combination', {
			  		stickers,
					});
			  	setCombinationSent(true);
					console.log(result);
				}}
			>
				Отправить комбинацию
			</Button>}
			{combinationSent && !gameResult && 'Ты уже отправил комбинацию, ждём...'}
		</Group>
		<Group header={<Header mode="secondary">Чат</Header>}>
			<div style={{ display: 'flex', width: '100%' }}>
				<Input
					style={{ flexGrow: 1, marginLeft: '8px' }}
					value={text}
					maxLength={70}
					onChange={(event) => {
						setText(event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.keyCode === 13) {
							handleSend(text);
						}
					}}
				/>
				<Button onClick={() => handleSend(text)} style={{ flex: '0 0 30px',marginRight: '8px' }}>
					<Icon24SendOutline />
				</Button>
			</div>
			{messages.map((message, i) => <Div key={i} className={message.outgoing ? 'InGame__message--outgoing' : 'InGame__message--ingoing'}>
				<span>
					{message.text}
				</span>
			</Div>)}
		</Group>
	</Panel>
};

export default InGame;
