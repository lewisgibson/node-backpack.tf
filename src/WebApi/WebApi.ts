import SteamID from "steamid";
import * as Common from '../Common';
import * as Responses from './WebApi.interface';

export default class WebApi {
    public constructor(private Key: string) {
        if (typeof Key !== 'string' || Key.length < 24 || Key.match(/^[a-z0-9]{24}$/) === null) throw new Error('Invalid API Key');
    }

    //#region Economy

    /**
     * Returns internal currency data for a given game.
     * 
     * @param raw If set to 1, adds a value_raw to the priceindex objects which represents the value of the item in the lowest currency without rounding. If a high value is set, the raw value will be an average between the low and high value. Setting raw to 2 prevents this behaviour by adding a new field, value_raw_high.
     */
    public GetCurrencies = <Raw extends boolean = undefined>(raw: boolean = false) =>
        Common.MakeRequest<Responses.IGetCurrencies<Raw>>({
            url: 'api/IGetCurrencies/v1',
            params: { raw, key: this.Key },
        });

    /**
     * Returns price history for an item.
     */
    public GetPriceHistory = (appid: Common.EAppIDs, item: string, quality: Common.EQuality, tradable: boolean = true, craftable: boolean, priceindex: Common.EUnusualEffects = Common.EUnusualEffects.None) =>
        Common.MakeRequest<Responses.IGetPriceHistory>({
            url: 'api/IGetPriceHistory/v1',
            params: { appid, item, quality, tradable: Common.TradableMapper(tradable), craftable: Common.CraftableMapper(craftable), priceindex, key: this.Key },
        });

    /**
     * Get price schema.
     * 
     * Won't work for games that aren't TF2. The response from this API is cached globally for 900 seconds.
     * 
     * @param raw If set to 1, adds a value_raw to the priceindex objects which represents the value of the item in the lowest currency without rounding. If a high value is set, the raw value will be an average between the low and high value. Setting raw to 2 prevents this behaviour by adding a new field, value_high_raw.
     * @param since If set, only returns prices that have a last_update value greater than or equal to this UNIX time. Recommended for implementing delta updates, as this will reduce the bandwidth requirements of your client.
     */
    public GetPrices = (raw: boolean = false, since?: number) =>
        Common.MakeRequest<Responses.IGetPrices>({
            url: 'api/IGetPrices/v4',
            params: { raw, ...(since !== undefined && { since }), key: this.Key },
        });

    /**
     * Get special internal items.
     * 
     * Returns internal backpack.tf item placeholders for a given game.
     */
    public GetSpecialItems = (appid: Common.EAppIDs) =>
        Common.MakeRequest<Responses.IGetSpecialItems>({
            url: 'api/IGetSpecialItems/v1',
            params: { appid, key: this.Key },
        });

    //#endregion

    //#region Users

    /**
     * Get user data.
     */
    private ParseIDToString = (id: string | SteamID) => id instanceof SteamID ? id.getSteamID64() : id;

    public GetUsers = (steamids: (string | SteamID)[] | string | SteamID) => 
        Common.MakeRequest<Responses.IGetUsers>({
            url: 'api/IGetUsers/v3',
            params: { steamids: Array.isArray(steamids) ? steamids.map(this.ParseIDToString) : this.ParseIDToString(steamids), key: this.Key },
        });

    /**
     * Get impersonated users.
     * Get a list of impersonated users. Impersonated users are defined as having the banner on their backpack.tf profile.
     */
    public GetImpersonatedUsers = (limit?: number, skip?: number) =>
        Common.MakeRequest<Responses.IGetImpersonatedUsers>({
            url: 'api/IGetUsers/GetImpersonatedUsers',
            params: {
                ...(limit !== undefined && { limit }),
                ...(skip !== undefined && { skip }),
                key: this.Key
            },
        });

    /**
     * Get user info.
     */
    public GetUserInfo = () =>
        Common.MakeRequest<Responses.IGetUserInfo>({
            url: 'api/users/info/v1',
            params: { key: this.Key },
        });

    //#endregion

    //#region Classifieds

    /**
     * Get user listings.
     */
    public GetUserTrades = () =>
        Common.MakeRequest<Responses.IGetUserTrades>({
            url: 'api/IGetUserTrades/v1',
            params: { key: this.Key },
        });

    /**
     * Search classifieds.
     */
    public SearchClassifieds = () =>
        Common.MakeRequest<Responses.ISearchClassifieds>({
            url: 'api/classifieds/search/v1',
            params: { key: this.Key },
        });

    /**
     * Get session user listings.
     */
    public GetListings = () =>
        Common.MakeRequest<Responses.IGetListings>({
            url: 'api/classifieds/listings/v1',
            params: { key: this.Key },
        });

    /**
     * Bulk delete listings.
     */
    public DeleteListings = () =>
        Common.MakeRequest<Responses.IDeleteListings>({
            url: 'api/classifieds/delete/v1',
            method: "DELETE",
            params: { key: this.Key },
        });

    /**
     * Bulk create classifieds listings.
     */
    public CreateListings = () =>
        Common.MakeRequest<Responses.ICreateListings>({
            url: 'api/classifieds/list/v1',
            method: "POST",
            params: { key: this.Key },
        });

    //#endregion
}
