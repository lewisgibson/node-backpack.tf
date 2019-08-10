import { AccessToken } from 'simple-oauth2';
import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tradable, Craftable } from './Types/Static';

/**
 * Internal Request Type Wrapping.
 */
export const MakeRequest = async <T>(ReqOptions: AxiosRequestConfig, Token?: AccessToken) => {
    const Response: AxiosResponse<T> = await Axios({
        ...ReqOptions,
        url: `https://backpack.tf/${ReqOptions.url}`,
        ...(Token !== undefined && { headers: { code: Token } }),
    });

    return Response.data;
};

export const TradableMapper = (Tradable: boolean): Tradable => (Tradable ? 'Tradable' : 'Non-Tradable');
export const CraftableMapper = (Craftable: boolean): Craftable => (Craftable ? 'Craftable' : 'Non-Craftable');
