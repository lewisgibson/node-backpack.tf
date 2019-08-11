import * as Static from './Static';

/**
 * Represents the raw parameter passed.
 */
export enum ERawType {
    Disabled = 0,
    Raw = 1,
    RawHigh = 2,
}

/**
 * Represents the additional object properties when raw=1 is passed.
 */
export interface RawItemPrice {
    /**
     * Item's value in the lowest currency without rounding.
     *
     * If raw is set to ERawType.RawHigh, this is the lower value if a high value exists.
     * Otherwise, this is the average between the high and low value.
     *
     * Requires raw = ERawType.Raw
     */
    value_raw: number;
}

export interface HighRawItemPrice extends RawItemPrice {
    /**
     * Item's value in the lowest currency without rounding.
     * This is the high value if it exists.
     *
     * Requires raw = ERawType.RawHigh
     */
    value_raw_high?: number;
}

/**
 * Conditional wrapper for the enum
 */
export type RawPrice<T extends ERawType> = T extends ERawType.Raw ? RawItemPrice : T extends ERawType.RawHigh ? HighRawItemPrice : {};

/**
 * Represents a pricing entry for an item or currency.
 */
export type IPrice<A extends boolean = false> = {
    /**
     * Value of the item, in the given currency
     */
    value: number;

    /**
     * Internal currency name for the price.
     */
    currency: Static.Currencies;

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
    value_high?: number;
} & (A extends true
    ? {
          /**
           * If set, item is an australium weapon.
           */
          australium: number;
      }
    : {});

export type IPriceEntry<Raw extends ERawType> = IPrice & RawPrice<Raw>;

/**
 * Represents an individual currency.
 */
export interface ICurrency<Raw extends ERawType> {
    /**
     * The currency name.
     */
    name: string;

    /**
     * The currency quality.
     */
    quality: Static.EQuality;

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
    priceindex: Static.EUnusualEffects;

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
    craftable: Static.Craftable;

    /**
     * Item tradability.
     */
    tradable: Static.Tradable;

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
 * Represents the history of an item
 */
export interface IPriceHistory {
    /**
     * Value of the item, in the given currency
     */
    value: number;

    /**
     * Upper bound value for the item. Only set if the item has a price range.
     */
    value_high?: number;

    /**
     * Internal currency name for the price.
     */
    currency: Static.Currencies;

    /**
     * The unix timestamp of when this items price was last updated.
     */
    timestamp: number;
}

/**
 * Represents an item
 */
export interface IItemRecord {
    defindex: number[];
    prices: Record<Static.EQuality, Record<Static.Tradable, Record<Static.Craftable, Record<Static.EUnusualEffects, IPrice<true>>>>>;
}

/**
 * Represents a player as a bptf struct
 */
export interface IPlayerRecord {
    steamid: number;
    success: boolean;
    backpack_value: Record<Static.EAppIDs, number>;
    backpack_update: Record<Static.EAppIDs, number>;
    name: string;
    backpack_tf_trust: {
        for: number;
        against: number;
    };
}

/**
 *  Represents a record of an impersonator
 */
export interface IImpersonatedUser {
    /**
     * SteamID64
     */
    SteamID64: number;

    /**
     * Persona name
     */
    personaname: string;

    /**
     * Avatar URL
     */
    avatar: string;
}

/**
 * Represents a single ban
 */
export interface IBan {
    end: number;
    reason?: string;
}

/**
 * Represents a website user
 */
export interface IUser {
    /**
     * User's name on Steam.
     */
    name: string;

    /**
     * User's avatar on Steam.
     */
    avatar: string;

    /**
     * Unix timestamp, at which the user last used the site.
     */
    last_online: number;

    /**
     * If set, user is a backpack.tf admin.
     */
    admin?: boolean;

    /**
     * How much the user has donated to the site, in USD.
     */
    donated: number;

    /**
     * If set, user has backpack.tf Premium.
     */
    premium?: boolean;

    /**
     * How many months of Premium this user has gifted away.
     */
    premium_months_gifted: number;

    /**
     * Various integrations.
     * Subproperties in this property may be changed at any time and are not part of any stability promise.
     */
    integrations: {
        /**
         * If set, user is a member of the Meet the Stats group.
         */
        group_member?: boolean;

        /**
         * If set, user is a registered Marketplace.tf seller.
         */
        marketplace_seller?: boolean;

        /**
         * If set, user is currently online with backpack.tf Automatic.
         */
        automatic?: boolean;

        /**
         * If set, user is a SteamRep admin.
         */
        steamrep_admin?: boolean;
    };

    /**
     * User's bans, including Valve bans.
     */
    bans: {
        /**
         * If set, user has a SteamRep scammer tag.
         */
        steamrep_scammer?: boolean;

        /**
         * If set, user has a SteamRep caution tag.
         */
        steamrep_caution?: boolean;

        /**
         * Contains the properties "economy", "community", "vac", and "game". If these are set, the user has the accompanying Valve-issued ban.
         */
        valve: {
            economy?: boolean;
            community?: boolean;
            vac?: boolean;
            game?: boolean;
        };

        /**
         * If set, user is banned from all features.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        all?: IBan;

        /**
         * If set, user is banned from price suggestions.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        suggestions?: IBan;

        /**
         * If set, user is banned from suggestion comments.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        comments?: IBan;

        /**
         * If set, user is banned from trust.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        trust?: IBan;

        /**
         * If set, user is banned from issue tracker.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        issues?: IBan;

        /**
         * If set, user is banned from classifieds.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        classifieds?: IBan;

        /**
         * If set, user is banned from profile customizations.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        customizations?: IBan;

        /**
         * If set, user is banned from reports.
         *
         * Contains an "end" property, which is -1 if the ban is permanent.
         *
         * Contains a "reason" property if one was provided.
         */
        reports?: IBan;
    };

    /**
     * User backpack.tf trust scores.
     */
    trust: {
        /**
         * How many positive trusts this user has.
         */
        positive: number;

        /**
         * How many negative trusts this user has.
         */
        negative: number;
    };

    /**
     * Concise inventory statistics.
     */
    inventory: Record<
        Static.EAppIDs,
        {
            /**
             * If set, user's backpack.tf ranking for this game.
             */
            ranking: number;

            /**
             * Community inventory value (TF2) or market inventory value (D2/CSGO).
             */
            value: number;

            /**
             * Unix timestamp, at which the inventory was last updated.
             */
            updated: number;

            /**
             * If set, how much pure metal is in this inventory.
             */
            metal?: number;

            /**
             * If set, how many pure keys are in this in inventory.
             */
            keys?: number;

            /**
             * Inventory slots.
             */
            slots: {
                /**
                 * How many slots are used in this inventory.
                 */
                used: number;

                /**
                 * How many slots are available in this inventory.
                 */
                total: number;
            };
        }
    >;

    /**
     * User's voting and suggestion stats.
     */
    voting: {
        /**
         * User's on-site voting reputation.
         */
        reputation: number;

        /**
         * Details on the user's voting activity.
         */
        votes: {
            /**
             * How many positive votes this user has casted.
             */
            positive: number;

            /**
             * How many negative votes this user has casted.
             */
            negative: number;

            /**
             * How many votes were accurate.
             */
            accepted: number;
        };

        /**
         * Details on the user's suggestion activity.
         */
        suggestions: {
            /**
             * How many suggestions this user has created.
             */
            created: number;

            /**
             * How many of those were accepted.
             */
            accepted: number;

            /**
             * How many accepted Unusual suggestions this user has.
             *
             * Unusual suggestions are considerably harder to make.
             */
            accepted_unusual: number;
        };
    };
}

/**
 * Represents an item tag/attribute
 */
export interface IItemAttribute {
    defindex: number;
    value: number | string;
    float_value?: number;
}

/**
 * Represents a web api styled item
 */
export interface IItem {
    id: number;
    original_id: number;
    defindex: number;
    level: number;
    quality: Static.EQuality;
    inventory: number;
    quantity: number;
    origin: number;
    style: Static.EUnusualEffects;
    attributes: IItemAttribute[];
    name: string;
}

/**
 * Represents a classified item listing
 */
export interface IClassifiedListing<T extends boolean = false, U extends Static.EListingIntent = undefined> {
    /**
     * The listing's internal id. Guaranteed to be unique.
     */
    id: string;

    /**
     * Steam ID of the user who created this listing.
     */
    steamid: number;

    /**
     * WebAPI-style item object, including special "name" property. A "marketplace_price" property will be available if the listing is a Marketplace.tf cross-listing.
     */
    item: IItem;

    /**
     * Which game this listing belongs to.
     */
    appid: Static.EAppIDs;

    /**
     * Which currencies the user is looking for. Uses backpack.tf internal currency names (e.g. metal).
     */
    currencies: Static.Currencies;

    /**
     * Whether the user accepts trade offers or only adds for this listing.
     */
    offers: boolean;

    /**
     * Whether the user allows negotiation.
     */
    buyout: boolean;

    /**
     * User entered listing comment.
     *
     * This is not html-escaped.
     */
    details: string;

    /**
     * Unix timestamp, at which the listing was created.
     */
    created: number;

    /**
     * Unix timestamp, at which the listing was last bumped. If the listing has never been bumped, this will be equal to created.
     */
    bump: number;

    /**
     * Either 0 (Buy) or 1 (Sell).
     */
    intent: U extends undefined ? Static.EListingIntent : U;

    /**
     * Set if the user will automatically accept a matching offer.
     */
    automatic?: boolean;

    /**
     * If the listing would be folded, refers to how many items this listing stacks.
     */
    count: number;

    /**
     * If set, the listing is a Premium promoted listing.
     */
    promoted?: boolean;
}

/**
 * Represents the error response for
 */
export interface ICreateListingRelistTimeout {
    error: Static.ECreateListingFailure.RelistTimeout;

    /**
     * Unix timestamp, at which the listing may be relisted.
     */
    retry: number;
}

export interface ICreateListingListingCapExceeded {
    error: Static.ECreateListingFailure.ListingCapExceeded;

    /**
     * How many listings you currently have.
     */
    used: number;

    /**
     * What your listing cap is.
     */
    cap: number;
}

export type ICreateListingError =
    | {
          /**
           * If set, an error occured.
           *
           * See the failure enum below.
           */
          error: Static.ECreateListingFailure;
      }
    | ICreateListingRelistTimeout
    | ICreateListingListingCapExceeded;

/**
 * Represents a classified item listing to create
 */
export interface IListingBuilder<T extends Static.EListingIntent = undefined> {
    /**
     * Either 0 (Buy) or 1 (Sell).
     */
    intent: T extends undefined ? Static.EListingIntent : T;

    /**
     * Set to 0 to only accept Steam friend requests.
     */
    offers?: boolean;

    /**
     * Set to 0 to allow negotiation.
     */
    buyout?: boolean;

    /**
     * Listing comment. Limited to 200 characters.
     */
    details?: string;

    /**
     * Mapping of internal currency name (see IGetCurrencies) to its price you wish to list the item for (e.g. "metal": 10).
     */
    currencies: Record<Static.Currencies, number>;
}

export interface ISellListingBuilder {
    /**
     * Used if the intent is 1 (Sell); current id of the item to list.
     *
     * If you have Marketplace.tf integration set up, this may also be an item from your Marketplace.tf item.
     */
    id: string;

    /**
     * Set to 1 to promote this listing.
     *
     * You must have promote listings (and therefore be Premium), otherwise it is ignored.
     *
     * Only supported by sell listings.
     */
    promoted?: boolean;
}

export interface IBuyListingBuilder {
    /**
     * Used if the intent is 0 (Buy); item specifier.
     *
     * This may change at any time.
     */
    item: {
        /**
         * Quality name or id. Supports elevated qualities (e.g. Strange Unusual), use a space.
         */
        quality: Static.EQuality;

        /**
         * Name of the item or its defindex.
         *
         * Supports Killstreaks and Australium (prefix the name with the killstreak in question, or "Australium").
         */
        item_name: string;

        /**
         * Use 0 or 'Non-Craftable' to list a non-craftable item.
         */
        craftable?: Static.Craftable;

        /**
         * Priceindex of the item (see IGetPrices).
         */
        priceindex?: Static.EUnusualEffects;
    };
}

export type ListingBuilder<T extends Static.EListingIntent = undefined> = IListingBuilder<T> &
    (T extends Static.EListingIntent.Buy ? IBuyListingBuilder : {}) &
    (T extends Static.EListingIntent.Sell ? ISellListingBuilder : {});
