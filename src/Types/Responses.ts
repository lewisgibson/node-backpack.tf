import { Static, Models } from '.';

type UndefinedGateway<T, K, U> = T extends undefined ? K : U;
type Unbox<T, U> = U extends keyof T ? T[U] : never;
type FilterUnion<T, K> = T extends K ? never : T;

export interface ResponseWrapper<T> {
    response: T;
}

export type UnwrapWebAPI<T> = Omit<FilterUnion<Unbox<T, keyof ResponseWrapper<void>>, WebAPIError>, keyof WebAPIResponse<void>>;

/**
 * Fallback when the request failed.
 */
export interface WebAPIError {
    /**
     * A legacy boolean determining success
     */
    success: false;

    /**
     * Why the request failed
     */
    message: string;
}

/**
 * Valid when the request was successful.
 */
export type WebAPIResponse<T> = {
    /**
     * A legacy boolean determining success
     */
    success: true;

    /**
     * The server time when the response was created.
     */
    current_time: number;
} & T;

/**
 * API response wrapper.
 */
export type WebAPICommon<T, K = {}> = UndefinedGateway<T, ResponseWrapper<WebAPIError>, ResponseWrapper<WebAPIError> | ResponseWrapper<WebAPIResponse<T>> & K>;

/**
 * API response for GET api/IGetCurrencies/v1
 */
export type IGetCurrencies<Raw extends Models.ERawType> = WebAPICommon<{
    /**
     * The App name.
     */
    name: string;

    /**
     * A Backpack.TF link to the marketplace of that app.
     */
    url: string;

    /**
     * An array of currency objects.
     */
    currencies: Record<Static.Currencies, Models.ICurrency<Raw>>;
}>;

/**
 * API response for GET api/IGetPriceHistory/v1
 */
export type IGetPriceHistory = WebAPICommon<{
    history: Models.IPriceHistory[];
}>;

/**
 * API response for GET api/IGetPrices/v4
 */
export type IGetPrices = WebAPICommon<
    {
        items: Record<string, Models.IItemRecord>;
    },
    {
        /**
         * The USD value of the smallest currency (i.e. Refined Metal).
         */
        raw_usd_value: number;

        /**
         * The name of the smallest currency as it appears in the priceindex objects.
         */
        usd_currency: string;

        /**
         * The definition index of the USD currency.
         */
        usd_currency_index: number;
    }
>;

/**
 * API response for GET api/IGetSpecialItems/v1
 */
export type IGetSpecialItems = WebAPICommon<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: Record<string, any>;
}>;

/**
 * API response for GET api/IGetUsers/v3
 */
export type IGetUsers = WebAPICommon<{
    /**
     * An object keyed by SteamID64, that has a value of IPlayerRecord
     */
    players: Record<number, Models.IPlayerRecord>;
}>;

/**
 * API response for GET api/IGetUsers/IGetImpersonatedUsers
 */
export type IGetImpersonatedUsers = WebAPICommon<{
    /**
     * Total number of impersonated users, for paging
     */
    total: number;

    /**
     * A list of impersonated users
     */
    results: Models.IImpersonatedUser[];
}>;

/**
 * API response for GET users/info/v1
 */
export type IGetUserInfo = WebAPICommon<{
    /**
     * Mapping of users and their user info.
     */
    users: Record<number, Models.IUser>;
}>;

/**
 * API response for GET api/classifieds/search/v1
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IGetUserTrades = WebAPICommon<Record<string, any>>;

export type ISearchClassifieds = WebAPICommon<
    {
        /**
         * Amount of listings matched by the query.
         */
        total: number;

        /**
         * How many listings were skipped for this "page".
         */
        skip: number;

        /**
         * How many listings are shown on this "page".
         */
        page_size: number;
    } & /**
     * Listings by intent.
     */ Record<
        'buy' | 'sell',
        {
            /**
             * Amount of listings matched by the query for this intent.
             */
            total: number;

            /**
             * Listings returned (array).
             *
             * May be empty if no listings match the query.
             */
            listings: Models.IClassifiedListing[];

            /**
             * Whether any folded listings were present in this selection.
             */
            fold: boolean;
        }
    >
>;

/**
 * API response for GET api/classifieds/listings/v1
 */
export type IGetListings<T extends boolean, U extends Static.EListingIntent> = WebAPICommon<{
    /**
     * Your listings cap.
     */
    cap: number;

    /**
     * How many promoted listing slots you have remaining. Only >0 if you have Premium.
     */
    promotes_remaining: number;

    /**
     * Listings returned (array).
     *
     * May be empty if you have no listings.
     */
    listings: Models.IClassifiedListing<T, U>;
}>;

/**
 * API response for DELETE api/classifieds/listings/v1
 */
export type IDeleteListings = WebAPICommon<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Record<string, any>;
}>;

/**
 * API response for POST api/classifieds/list/v1
 */
export type ICreateListings = WebAPICommon<{
    /**
     * Listing creation results.
     *
     * Keyed by item id (sell orders) or item name (buy orders), in the same order as the input.
     */
    listings: Record<
        string,
        | {
              /**
               * If set, the listing was created successfully.
               */
              created: boolean;
          }
        | Models.ICreateListingError
    >;
}>;
