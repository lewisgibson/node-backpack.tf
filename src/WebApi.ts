import SteamID from 'steamid';
import * as Common from './Common';
import { Models, Responses, Static } from './Types';

interface ISearchListingOpts {
    /**
     * Filter listings by intent.
     *
     * Default: dual. Valid options: sell, buy, dual.
     */
    intent: Static.ESearchIntent;

    /**
     * Modify the page size used to paginate.
     *
     * Must be >= 1 and <= 30.
     *
     * Use the "page" parameter to paginate.
     *
     * Default: 10.
     */
    page_size?: number;

    /**
     * If set to 0, disables listing folding.
     */
    fold?: boolean;

    /**
     * Item name to search for.
     */
    item?: string;

    /**
     * Only show listings created by the user whose Steam ID is passed.
     */
    steamid?: number;
}
const DefaultSearchListingOpts: ISearchListingOpts = {
    intent: Static.ESearchIntent.Dual,
    page_size: 10,
};

export class Legacy {
    private Token: string;

    /**
     * Updates your backpack tf token in the instance
     */
    public SetToken = (Token: string) => (this.Token = Token);

    /**
     * Get session user listings.
     */
    public GetListings = <T extends boolean, U extends Static.EListingIntent>(inactive: T, intent?: U) =>
        Common.MakeRequest<Responses.IGetListings<T, U>>({
            url: 'api/classifieds/listings/v1',
            params: {
                token: this.Token,
                ...(inactive !== undefined && { inactive }),
                ...(intent !== undefined && { intent }),
            },
        });

    /**
     * Bulk delete listings.
     */
    public DeleteListings = () =>
        Common.MakeRequest<Responses.IDeleteListings>({
            url: 'api/classifieds/delete/v1',
            method: 'DELETE',
            params: { token: this.Token },
        });

    /**
     * Bulk create classifieds listings.
     */
    public CreateListings = (listings: Models.ListingBuilder[]) =>
        Common.MakeRequest<Responses.ICreateListings>({
            url: 'api/classifieds/list/v1',
            method: 'POST',
            params: { token: this.Token, listings },
        });
}

export default class WebApi {
    public Legacy = new Legacy();

    public constructor(private Key: string, private Token?: string) {
        if (typeof Key !== 'string' || Key.length < 24 || Key.match(/^[a-z0-9]{24}$/) === null) throw new Error('Invalid API Key');
        if (Token !== undefined) {
            if (typeof Token !== 'string' || Token.length < 24 || Token.match(/^[a-z0-9]{24}$/) === null) throw new Error('Invalid Token');
            else this.Legacy.SetToken(Token);
        }
    }

    //#region Economy

    /**
     * Returns internal currency data for a given game.
     *
     * @param raw
     * If set to 1, adds a value_raw to the priceindex objects which represents the value of the item in the lowest currency without rounding.
     * If a high value is set, the raw value will be an average between the low and high value.
     * Setting raw to 2 prevents this behaviour by adding a new field, value_raw_high.
     */
    public GetCurrencies = <T extends Models.ERawType = Models.ERawType.Disabled>(raw: T) =>
        Common.MakeRequest<Responses.IGetCurrencies<T>>({
            url: 'api/IGetCurrencies/v1',
            params: { raw, key: this.Key },
        });

    /**
     * Returns price history for an item.
     */
    public GetPriceHistory = (
        appid: Static.EAppIDs,
        item: string,
        quality: Static.EQuality,
        tradable: boolean = true,
        craftable: boolean,
        priceindex: Static.EUnusualEffects = Static.EUnusualEffects.None,
    ) =>
        Common.MakeRequest<Responses.IGetPriceHistory>({
            url: 'api/IGetPriceHistory/v1',
            params: {
                appid,
                item,
                quality,
                tradable: Common.TradableMapper(tradable),
                craftable: Common.CraftableMapper(craftable),
                priceindex,
                key: this.Key,
            },
        });

    /**
     * Get price schema.
     *
     * Won't work for games that aren't TF2.
     *
     * The response from this API is cached globally for 900 seconds.
     *
     * @param raw If set to 1, adds a value_raw to the priceindex objects which represents the value of the item in the lowest currency without rounding. If a high value is set, the raw value will be an average between the low and high value. Setting raw to 2 prevents this behaviour by adding a new field, value_high_raw.
     * @param since If set, only returns prices that have a last_update value greater than or equal to this UNIX time. Recommended for implementing delta updates, as this will reduce the bandwidth requirements of your client.
     */
    public GetPrices = <T extends Models.ERawType = Models.ERawType.Disabled>(raw: T, since?: number) =>
        Common.MakeRequest<Responses.IGetPrices>({
            url: 'api/IGetPrices/v4',
            params: { raw, ...(since !== undefined && { since }), key: this.Key },
        });

    /**
     * Get special internal items.
     *
     * Returns internal backpack.tf item placeholders for a given game.
     */
    public GetSpecialItems = (appid: Static.EAppIDs) =>
        Common.MakeRequest<Responses.IGetSpecialItems>({
            url: 'api/IGetSpecialItems/v1',
            params: { appid, key: this.Key },
        });

    //#endregion

    //#region Users

    /**
     * Get user data.
     */
    private ParseIDToString = (id: string | SteamID) => (id instanceof SteamID ? id.getSteamID64() : id);

    public GetUsers = (steamids: (string | SteamID)[] | string | SteamID) =>
        Common.MakeRequest<Responses.IGetUsers>({
            url: 'api/IGetUsers/v3',
            params: {
                steamids: Array.isArray(steamids) ? steamids.map(this.ParseIDToString) : this.ParseIDToString(steamids),
                key: this.Key,
            },
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
                key: this.Key,
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
    public SearchClassifieds = (Options?: ISearchListingOpts) =>
        Common.MakeRequest<Responses.ISearchClassifieds>({
            url: 'api/classifieds/search/v1',
            params: Object.assign({ key: this.Key }, DefaultSearchListingOpts, Options),
        });

    //#endregion
}
