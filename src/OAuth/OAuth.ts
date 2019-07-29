import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import SimpleOAuth2 from 'simple-oauth2';

export interface ISessionResponse {
    [key: string]: string;
}

export default class OAuth {
    private OAuthClient!: SimpleOAuth2.OAuthClient;
    private Base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

    /**
     * Internal Request Type Wrapping.
     */
    private MakeRequest = async <T>(ReqOptions: AxiosRequestConfig, Token?: SimpleOAuth2.AccessToken) => {
        const Response: AxiosResponse<T> = await Axios({
            ...ReqOptions,
            ...(Token !== undefined && { headers: { code: Token } }),
        });

        return Response.data;
    };

    /**
     * Initialises an OAuth Client.
     */
    public constructor(ClientID: string, ClientSecret: string) {
        if (typeof ClientID !== 'string' || ClientID.length !== 24) throw new Error('Invalid ClientID');
        if (typeof ClientSecret !== 'string' || ClientSecret.length === 0 || ClientSecret.match(this.Base64Regex) === null)
            throw new Error('Invalid ClientSecret');

        this.OAuthClient = SimpleOAuth2.create({
            client: {
                id: ClientID,
                secret: ClientSecret,
            },
            auth: {
                tokenHost: 'https://backpack.tf/',
                tokenPath: '/oauth/access_token',
            },
            http: {
                headers: {
                    Accept: '1.0',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
            options: {
                authorizationMethod: 'body',
            },
        });
    }

    /**
     * Retrieves an OAuth Token.
     */
    public GetToken = async () => this.OAuthClient.accessToken.create(await this.OAuthClient.clientCredentials.getToken({ scope: 'read write' }));
}
