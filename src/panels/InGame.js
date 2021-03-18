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
import { apiSendMessage } from '../Api';

const InGame = ({ id, go, pairedUser, fetchedUser, messages, addMessage }) => {
	const [text, setText] = React.useState('');

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
			Game
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
		<Group header={<Header mode="secondary">Чат</Header>}>
			<Div>
				<Input
					value={text}
					onChange={(event) => {
						setText(event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.keyCode === 13) {
							handleSend(text);
						}
					}}
				/>
				<Button onClick={() => handleSend(text)}>Отправить</Button>
			</Div>
			{messages.map((message) => <Div className={message.outgoing ? 'InGame__message--outgoing' : 'InGame__message--ingoing'}>
				<span>
					{message.text}
				</span>
			</Div>)}
		</Group>
	</Panel>
};

export default InGame;
