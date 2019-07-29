import * as Common from '../Common';

/**
 * API response wrapper.
 */
export interface WebAPICommon<T> {
    response: T extends undefined ? WebAPIError : WebAPIError | WebAPIResponse<T>;
}

/**
 * Fallback when the request failed.
 */
export interface WebAPIError {
    success: false;
    message: string;
}

/**
 * Valid when the request was successful.
 */
export type WebAPIResponse<T> = { success: true } & T;

/**
 * Represents the additional object properties when raw=1 is passed.
 */
export interface RawItemPrice { 
    /**
     * Item's value in the lowest currency without rounding. If raw is set to 2, this is the lower value if a 
     * high value exists. Otherwise, this is the average between the high and low value. 
     * 
     * Requires raw = true.
     */
    value_raw: number; 
}

/**
 * Represents a pricing entry for an item or currency.
 */
export type IPriceEntry<Raw extends boolean = undefined> = {
    /**
     * Value of the item, in the given currency
     */
    value: number;

    /**
     * Internal currency name for the price.
     */
    currency: Common.Currencies;

    /**
     * The difference between the current price and the last time this item was priced.
     */
    difference: number;

    /**
     * The unix timestamp of when this items price was last updated.
     */
    last_update: number;

    /**
     * Upper bound value for the item. Only set if the item has a price range.
     */
    value_high: number;
} & Raw extends true
    ? RawItemPrice
    : Raw extends undefined
        ? Partial<RawItemPrice>
        : never;

/**
 * Represents an individual currency.
 */
export interface ICurrency<Raw extends boolean = undefined> {
    /**
     * The currency name.
     */
    name: string;

    /**
     * The currency quality.
     */
    quality: Common.EQuality;

    /**
     * The priceindex is an attribute that is applied to priced items that share the same definition index and quality. For most items, it is zero. Otherwise, the use varies by context:
     * 
     * Particle effects: 
     * The priceindex will correspond to the ID 
     * of the particle as documented in the Valve Web API.
     * 
     * Crates: 
     * The priceindex corresponds to the crate series.
     * 
     * Strangifiers/Unusualifiers: 
     * The priceindex of a Strangifier/Unusualifier 
     * corresponds to the definition index of the item it can be used on.
     * 
     * Chemistry Sets: 
     * The priceindex of a Chemistry Set is a hyphen-delimited string 
     * of two numbers; the definition index and the quality of the item. 1086-14 is the 
     * priceindex for a Collector's Festive Wrangler.
     */
    priceindex: Common.EUnusualEffects;

    /**
     * Singular form of the noun used for the suffix of the currency.
     */
    single: string;

    /**
     * Plural form of the noun used for the suffix of the currency.
     */
    plural: string;

    /**
     * Number of decimal places the price should be rounded to.
     */
    round: number;

    blanket: number;

    /**
     * Item craftability.
     */
    craftable: Common.Craftable;

    /**
     * Item tradability.
     */
    tradable: Common.Tradable;

    /**
     * A definition index associated with Valve infrastructure.
     */
    defindex: number;

    /**
     * if 1, then this currency should be used when rounding up the currencies of an item. 
     * For example, the hat currency will have this value set to 0 because we do not 
     * want to price items in multiples of hats.
     */
    active: boolean;

    /**
     * An object containing pricing information.
     */
    price: IPriceEntry<Raw>;
}

/**
 * API response for GET api/IGetCurrencies/v1
 */
export type IGetCurrencies<Raw extends boolean = undefined> = WebAPICommon<{
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
    currencies: Record<Common.Currencies, ICurrency<Raw>>;
}>;

export interface IGetPriceHistory {
    a: number;
}

export interface IGetPrices {
    a: number;
}

export interface IGetSpecialItems {
    a: number;
}

export interface IGetUsers {
    a: number;
}

export interface IGetImpersonatedUsers {
    a: number;
}

export interface IGetUserInfo {
    a: number;
}

export interface IGetUserTrades {
    a: number;
}

export interface ISearchClassifieds {
    a: number;
}

export interface IGetListings {
    a: number;
}

export interface IDeleteListings {
    a: number;
}

export interface ICreateListings {
    a: number;
}