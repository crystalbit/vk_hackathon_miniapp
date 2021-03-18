import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import { apiAddUser, apiGetState } from '../Api';

const TIMER_ENDED = -1;
const TIMER_LOADING = null;
const MAX_SECONDS = 60;

const States = {
	LOADING: 'loading',
	NEW: 'new',
	WAITING: 'Waiting',
};

const Home = ({ id, go, fetchedUser }) => {
	// в waitingState время начала нахождения в очереди
	const [waitingState, setWaitingState] = useState(null);
	const [timer, setTimer] = useState(TIMER_LOADING);
	const [state, updateState] = useState(States.LOADING);

	useEffect(() => {
		const ticker = setInterval(() => {
			if (waitingState === null) {
				if (timer !== TIMER_ENDED) {
					setTimer(TIMER_ENDED);
				}
				return;
			}
			if (+new Date - waitingState < MAX_SECONDS * 1000) {
				const seconds = MAX_SECONDS - Math.floor( (+new Date - waitingState) / 1000);
				if (seconds !== timer) {
					setTimer(seconds);
				}
			} else {
				setTimer(TIMER_ENDED);
				setWaitingState(null);
				updateState(States.NEW);
			}
		}, 500);
		return () => clearInterval(ticker);
	}, [waitingState]);

	useEffect(() => {
		if (!fetchedUser) {
			return;
		}

		async function fetchData() {
			const state = await apiGetState(fetchedUser.id);
			updateState(state.state);
			if (state.state === States.NEW) {

			} else if (state.state === States.WAITING) {
				setWaitingState(state.start - state.now + +new Date());
			} else {
				console.log('ERROR STATE');
			}

		}
		fetchData();
	}, [fetchedUser]);

	return (
		<Panel id={id}>
			<PanelHeader>Example Game</PanelHeader>
			{![TIMER_ENDED, TIMER_LOADING].includes(timer) && <div>Ожидание противников: {timer}</div>}
			{timer === TIMER_ENDED && <div>Вы не в игре</div>}
			{timer === TIMER_LOADING && <div>Загрузка...</div>}
			{state === States.NEW && fetchedUser && <div>
				<button onClick={() => {
					apiAddUser(fetchedUser.id).then((res) => {
						console.log({ res });
						const { queued, enemy, start, now } = res;
						if (queued) {
							setWaitingState(start - now + +new Date());
							updateState(States.WAITING);
							// нет противников, встали в очередь
						} else {
							console.log({ enemy });
						}
					});
				}}>
					В игру!
				</button>
			</div>}
			{fetchedUser &&
			<Group header={<Header mode="secondary">Твой боец:</Header>}>
				<Cell
					before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
					description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
				>
					{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
				</Cell>
			</Group>}

			<Group header={<Header mode="secondary">Navigation Example</Header>}>
				<Div>
					--
				</Div>
			</Group>
		</Panel>
	);
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
