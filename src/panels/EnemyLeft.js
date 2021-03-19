import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { GAME_NAME } from '../config';
import { Button } from '@vkontakte/vkui';

const EnemyLeft = ({ id, pairedUser, go }) => {

	return (
		<Panel id={id}>
			<PanelHeader>{GAME_NAME} – игра окончена</PanelHeader>
			{pairedUser && <Group header={<Header mode="secondary">Вот этот человек сейчас вышел из игры:</Header>}>
				<Cell
					before={pairedUser.photo_200 ? <Avatar src={pairedUser.photo_200}/> : null}
					description={pairedUser.city && pairedUser.city.title ? pairedUser.city.title : ''}
				>
					{`${pairedUser.first_name} ${pairedUser.last_name}`}
				</Cell>
				<Div>
					<Button
						onClick={go}
						data-to="home"
					>На главную</Button>
				</Div>
			</Group>}
		</Panel>
	);
};

export default EnemyLeft;
