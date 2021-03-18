import bridge from '@vkontakte/vk-bridge';

export class VkApi {
  bridge = null;
  access_token = '';

  constructor (bridge) {
    this.bridge = bridge;
  }

  async updateToken() {
    if (this.access_token !== '') {
      return;
    }
    const { access_token } = await bridge.send("VKWebAppGetAuthToken", { app_id: 7794722, scope: '' });
    this.access_token = access_token;
  }

  async getUserById(id) {
    await this.updateToken();
    const user = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'users.get',
      params: {
        v: '5.130',
        user_ids: id.toString(),
        access_token: this.access_token,
        fields: 'photo_100,photo_200,city',
      }
    });
    return user.response[0];
  }
}
