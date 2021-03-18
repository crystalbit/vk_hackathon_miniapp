import React, { useState, useEffect, MutableRefObject } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { io, Socket } from 'socket.io-client';

import Home from './panels/Home';
import InGame from './panels/InGame';
import { getWSUri } from './Api';
import { VkApi } from './VkApi';
import EnemyLeft from './panels/EnemyLeft';

const vkApi = new VkApi(bridge);

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [pairedUser, setPairedUser] = useState(null);

	const [messages, setMessages] = useState([]);

	const addMessage = (text, outgoing) => {
		setMessages(messages => {
			const newMessages = [...messages];
			if (newMessages.length > 9) {
				newMessages.splice(9);
			}
			console.log({ messages, newMessages });
			newMessages.unshift({ text, outgoing });
			return newMessages;
		});
	};

	/** @type {MutableRefObject<Socket>} */
	const socket = React.useRef();

	const startWS = (userId) => {
		socket.current = io(getWSUri(), {
			query: { userId },
		});

		socket.current.on('text', (data) => {
			addMessage(data, false);
		});

		socket.current.on('paired', async data => {
			try {
				const user = await vkApi.getUserById(data);
				setPairedUser(user);
				setActivePanel('in-game');
			} catch (error) {
				console.log(error)
			}
		});

		socket.current.on('enemy_left', () => {
			setActivePanel('enemy-left');
		});
	};

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			console.log({ user });
			startWS(user.id);
			setUser(user);
			setPopout(null);
		}
		fetchData();

	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id="home" fetchedUser={fetchedUser} go={go} />
					<InGame
						id="in-game"
						fetchedUser={fetchedUser}
						pairedUser={pairedUser}
						go={go}
						messages={messages}
						addMessage={addMessage}
					/>
					<EnemyLeft
						id="enemy-left"
						pairedUser={pairedUser}
						go={go}
					/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;

