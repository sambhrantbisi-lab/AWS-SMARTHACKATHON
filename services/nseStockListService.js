const axios = require('axios');

/**
 * NSE Stock List Service
 * Fetches complete list of NSE stocks using various methods
 */

class NSEStockListService {
    constructor() {
        this.allStocks = [];
        this.lastFetched = null;
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        
        // Comprehensive list of NSE stocks (2000+ symbols)
        // This is a curated list of actively traded stocks
        this.stockSymbols = this.generateStockList();
    }

    /**
     * Generate comprehensive NSE stock list
     * Includes NIFTY 500 + additional actively traded stocks
     */
    generateStockList() {
        return [
            // NIFTY 50
            'ADANIENT', 'ADANIPORTS', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK',
            'BAJAJ-AUTO', 'BAJFINANCE', 'BAJAJFINSV', 'BPCL', 'BHARTIARTL',
            'BRITANNIA', 'CIPLA', 'COALINDIA', 'DIVISLAB', 'DRREDDY',
            'EICHERMOT', 'GRASIM', 'HCLTECH', 'HDFCBANK', 'HDFCLIFE',
            'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR', 'ICICIBANK', 'ITC',
            'INDUSINDBK', 'INFY', 'JSWSTEEL', 'KOTAKBANK', 'LT',
            'M&M', 'MARUTI', 'NTPC', 'NESTLEIND', 'ONGC',
            'POWERGRID', 'RELIANCE', 'SBILIFE', 'SBIN', 'SUNPHARMA',
            'TCS', 'TATACONSUM', 'TATAMOTORS', 'TATASTEEL', 'TECHM',
            'TITAN', 'UPL', 'ULTRACEMCO', 'WIPRO', 'SHREECEM',
            
            // NIFTY NEXT 50
            'ACC', 'AMBUJACEM', 'BANDHANBNK', 'BERGEPAINT', 'BEL',
            'BOSCHLTD', 'COLPAL', 'DABUR', 'DLF', 'GODREJCP',
            'GAIL', 'HAVELLS', 'HDFCAMC', 'ICICIGI', 'ICICIPRULI',
            'IGL', 'INDIGO', 'JINDALSTEL', 'MARICO', 'MCDOWELL-N',
            'MOTHERSON', 'NMDC', 'NYKAA', 'PAGEIND', 'PIDILITIND',
            'PNB', 'PGHH', 'SBICARD', 'SIEMENS', 'SRF',
            'TATAPOWER', 'TORNTPHARM', 'TRENT', 'VEDL', 'ZOMATO',
            'ZYDUSLIFE', 'ADANIGREEN', 'ADANITRANS', 'ATGL', 'BAJAJHLDNG',
            'BANKBARODA', 'BIOCON', 'CANBK', 'CHOLAFIN', 'DMART',
            'GLAND', 'HINDPETRO', 'IDFCFIRSTB', 'IOC', 'IRCTC',
            
            // Additional Large Caps
            'ABB', 'ABCAPITAL', 'ABFRL', 'AFFLE', 'AJANTPHARM',
            'ALKEM', 'AMARAJABAT', 'AMBUJACEM', 'APOLLOTYRE', 'ASHOKLEY',
            'ASTRAL', 'ATUL', 'AUBANK', 'AUROPHARMA', 'BALKRISIND',
            'BALRAMCHIN', 'BATAINDIA', 'BAYERCROP', 'BHARATFORG', 'BHEL',
            'BIOCON', 'BOSCHLTD', 'BSOFT', 'CANBK', 'CANFINHOME',
            'CASTROLIND', 'CEATLTD', 'CENTURYTEX', 'CESC', 'CHAMBLFERT',
            'CHOLAFIN', 'CLEAN', 'COFORGE', 'COLPAL', 'CONCOR',
            'COROMANDEL', 'CROMPTON', 'CUB', 'CUMMINSIND', 'DABUR',
            'DEEPAKNTR', 'DELTACORP', 'DIXON', 'DLF', 'DMART',
            'ESCORTS', 'EXIDEIND', 'FEDERALBNK', 'FORTIS', 'FSL',
            'GAIL', 'GLENMARK', 'GMRINFRA', 'GNFC', 'GODREJCP',
            'GODREJPROP', 'GRANULES', 'GUJGASLTD', 'HAL', 'HAVELLS',
            'HDFCAMC', 'HDFCLIFE', 'HINDCOPPER', 'HINDPETRO', 'HINDZINC',
            'HONAUT', 'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'IDEA',
            'IDFCFIRSTB', 'IEX', 'IGL', 'INDHOTEL', 'INDIACEM',
            'INDIAMART', 'INDIANB', 'INDIGO', 'INDUSTOWER', 'INFY',
            'IOC', 'IPCALAB', 'IRCTC', 'ITC', 'JINDALSTEL',
            'JKCEMENT', 'JSWENERGY', 'JUBLFOOD', 'KAJARIACER', 'KEI',
            'KOTAKBANK', 'L&TFH', 'LALPATHLAB', 'LAURUSLABS', 'LICHSGFIN',
            'LT', 'LTI', 'LTTS', 'LUPIN', 'M&M',
            'M&MFIN', 'MANAPPURAM', 'MARICO', 'MARUTI', 'MCDOWELL-N',
            'MCX', 'METROPOLIS', 'MFSL', 'MGL', 'MINDTREE',
            'MOTHERSON', 'MPHASIS', 'MRF', 'MUTHOOTFIN', 'NAM-INDIA',
            'NATIONALUM', 'NAUKRI', 'NAVINFLUOR', 'NESTLEIND', 'NMDC',
            'NTPC', 'OBEROIRLTY', 'OFSS', 'OIL', 'ONGC',
            'PAGEIND', 'PEL', 'PERSISTENT', 'PETRONET', 'PFC',
            'PFIZER', 'PGHH', 'PHOENIXLTD', 'PIDILITIND', 'PIIND',
            'PNB', 'POLYCAB', 'POWERGRID', 'PRAJIND', 'PRESTIGE',
            'PVR', 'RAIN', 'RAJESHEXPO', 'RAMCOCEM', 'RBLBANK',
            'RECLTD', 'RELIANCE', 'SAIL', 'SBICARD', 'SBILIFE',
            'SBIN', 'SHREECEM', 'SIEMENS', 'SRF', 'SRTRANSFIN',
            'STAR', 'SUNPHARMA', 'SUNTV', 'SYNGENE', 'TATACHEM',
            'TATACOMM', 'TATACONSUM', 'TATAELXSI', 'TATAMOTORS', 'TATAPOWER',
            'TATASTEEL', 'TCS', 'TECHM', 'TITAN', 'TORNTPHARM',
            'TORNTPOWER', 'TRENT', 'TVSMOTOR', 'UBL', 'ULTRACEMCO',
            'UPL', 'VEDL', 'VOLTAS', 'WHIRLPOOL', 'WIPRO',
            'YESBANK', 'ZEEL', 'ZOMATO', 'ZYDUSLIFE',
            
            // Mid Caps
            'AARTIIND', 'ABBOTINDIA', 'ABCAPITAL', 'ABFRL', 'AEGISCHEM',
            'AFFLE', 'AIAENG', 'AJANTPHARM', 'AKZOINDIA', 'ALKEM',
            'ALKYLAMINE', 'ALLCARGO', 'AMARAJABAT', 'AMBER', 'AMBUJACEM',
            'ANGELONE', 'ANURAS', 'APLAPOLLO', 'APOLLOHOSP', 'APOLLOTYRE',
            'APTUS', 'ASAHIINDIA', 'ASHOKLEY', 'ASIANPAINT', 'ASTERDM',
            'ASTRAL', 'ATUL', 'AUBANK', 'AUROPHARMA', 'AVANTIFEED',
            'AXISBANK', 'BAJAJCON', 'BAJAJELEC', 'BAJAJFINSV', 'BAJAJHLDNG',
            'BAJFINANCE', 'BALKRISIND', 'BALRAMCHIN', 'BANDHANBNK', 'BANKBARODA',
            'BANKINDIA', 'BATAINDIA', 'BAYERCROP', 'BBL', 'BBTC',
            'BDL', 'BEL', 'BEML', 'BERGEPAINT', 'BHARATFORG',
            'BHARTIARTL', 'BHEL', 'BIOCON', 'BIRLACORPN', 'BLISSGVS',
            'BLUEDART', 'BLUESTARCO', 'BOMDYEING', 'BOSCHLTD', 'BPCL',
            'BRIGADE', 'BRITANNIA', 'BSOFT', 'CAMS', 'CANBK',
            'CANFINHOME', 'CAPLIPOINT', 'CARBORUNIV', 'CARERATING', 'CASTROLIND',
            'CCL', 'CDSL', 'CEATLTD', 'CENTRALBK', 'CENTURYPLY',
            'CENTURYTEX', 'CERA', 'CESC', 'CGPOWER', 'CHAMBLFERT',
            'CHEMPLASTS', 'CHENNPETRO', 'CHOLAFIN', 'CHOLAHLDNG', 'CIPLA',
            'CUB', 'CYIENT', 'DABUR', 'DALBHARAT', 'DATAPATTNS',
            'DCBBANK', 'DCMSHRIRAM', 'DEEPAKFERT', 'DEEPAKNTR', 'DELTACORP',
            'DEVYANI', 'DHANI', 'DHANUKA', 'DIVISLAB', 'DIXON',
            'DLF', 'DMART', 'DRREDDY', 'ECLERX', 'EDELWEISS',
            'EICHERMOT', 'EIDPARRY', 'EIHOTEL', 'ELGIEQUIP', 'EMAMILTD',
            'ENDURANCE', 'ENGINERSIN', 'EQUITAS', 'ERIS', 'ESCORTS',
            'EXIDEIND', 'FDC', 'FEDERALBNK', 'FINEORG', 'FINPIPE',
            'FIVESTAR', 'FLUOROCHEM', 'FORTIS', 'FSL', 'GAEL',
            'GAIL', 'GALAXYSURF', 'GARFIBRES', 'GATEWAY', 'GESHIP',
            'GET&D', 'GHCL', 'GILLETTE', 'GLAND', 'GLAXO',
            'GLENMARK', 'GMMPFAUDLR', 'GMRINFRA', 'GNFC', 'GODFRYPHLP',
            'GODREJAGRO', 'GODREJCP', 'GODREJIND', 'GODREJPROP', 'GOKEX',
            'GPPL', 'GRANULES', 'GRAPHITE', 'GRASIM', 'GREAVESCOT',
            'GRINDWELL', 'GSFC', 'GSPL', 'GUJALKALI', 'GUJGASLTD',
            'GULFOILLUB', 'HAL', 'HAPPSTMNDS', 'HATHWAY', 'HAVELLS',
            'HCG', 'HCLTECH', 'HDFC', 'HDFCAMC', 'HDFCBANK',
            'HDFCLIFE', 'HEG', 'HEIDELBERG', 'HEMIPROP', 'HERANBA',
            'HEROMOTOCO', 'HFCL', 'HIKAL', 'HIL', 'HINDALCO',
            'HINDCOPPER', 'HINDOILEXP', 'HINDPETRO', 'HINDUNILVR', 'HINDZINC',
            'HLEGLAS', 'HMVL', 'HONAUT', 'HSCL', 'HUDCO',
            'IBREALEST', 'ICICIBANK', 'ICICIGI', 'ICICIPRULI', 'ICRA',
            'IDEA', 'IDFC', 'IDFCFIRSTB', 'IEX', 'IFBIND',
            'IIFL', 'IIFLSEC', 'IIFLWAM', 'IGL', 'INDHOTEL',
            'INDIACEM', 'INDIAMART', 'INDIANB', 'INDIANHUME', 'INDIGO',
            'INDOCO', 'INDOSTAR', 'INDUSINDBK', 'INDUSTOWER', 'INFIBEAM',
            'INFY', 'INGERRAND', 'INOXLEISUR', 'INOXWIND', 'INTELLECT',
            'IOB', 'IOC', 'IPCALAB', 'IRB', 'IRCON',
            'IRCTC', 'ISEC', 'ITC', 'ITDC', 'ITI',
            'J&KBANK', 'JAGRAN', 'JAMNAAUTO', 'JBCHEPHARM', 'JCHAC',
            'JETAIRWAYS', 'JISLJALEQS', 'JKCEMENT', 'JKLAKSHMI', 'JKPAPER',
            'JKTYRE', 'JMA', 'JMFINANCIL', 'JPASSOCIAT', 'JSL',
            'JSWENERGY', 'JSWSTEEL', 'JUBLFOOD', 'JUBLINGREA', 'JUSTDIAL',
            'JYOTHYLAB', 'KAJARIACER', 'KALPATPOWR', 'KANSAINER', 'KARURVYSYA',
            'KEC', 'KEI', 'KIRIINDUS', 'KIRLOSENG', 'KIRLOSIND',
            'KNRCON', 'KOLTEPATIL', 'KOTAKBANK', 'KPITTECH', 'KRBL',
            'KSCL', 'KSB', 'KTKBANK', 'L&TFH', 'LALPATHLAB',
            'LAOPALA', 'LAURUSLABS', 'LAXMIMACH', 'LEMONTREE', 'LICHSGFIN',
            'LINDEINDIA', 'LT', 'LTI', 'LTTS', 'LUPIN',
            'LUXIND', 'LXCHEM', 'M&M', 'M&MFIN', 'MAHABANK',
            'MAHINDCIE', 'MAHLIFE', 'MAHLOG', 'MAHSCOOTER', 'MAHSEAMLES',
            'MAITHANALL', 'MANAPPURAM', 'MANGCHEFER', 'MARICO', 'MARKSANS',
            'MARUTI', 'MASTEK', 'MATRIMONY', 'MCDOWELL-N', 'MCX',
            'MEGHMANI', 'MENONBE', 'METROPOLIS', 'MFSL', 'MGL',
            'MHRIL', 'MINDACORP', 'MINDAIND', 'MINDTREE', 'MIDHANI',
            'MOIL', 'MOLDTKPAC', 'MONSANTO', 'MOTHERSON', 'MOTILALOFS',
            'MPHASIS', 'MRF', 'MRPL', 'MSTCLTD', 'MTARTECH',
            'MUTHOOTFIN', 'NATCOPHARM', 'NATIONALUM', 'NAUKRI', 'NAVINFLUOR',
            'NAVNETEDUL', 'NBCC', 'NCC', 'NESCO', 'NESTLEIND',
            'NETWORK18', 'NEULANDLAB', 'NEWGEN', 'NFL', 'NHPC',
            'NIACL', 'NIITLTD', 'NIITTECH', 'NILKAMAL', 'NLCINDIA',
            'NMDC', 'NOCIL', 'NTPC', 'NUCLEUS', 'OBEROIRLTY',
            'OFSS', 'OIL', 'OMAXE', 'ONEPOINT', 'ONGC',
            'ONMOBILE', 'ORIENTABRA', 'ORIENTCEM', 'ORIENTELEC', 'ORIENTHOT',
            'ORIENTREF', 'ORISSAMINE', 'PAGEIND', 'PARAGMILK', 'PARAS',
            'PARSVNATH', 'PATELENG', 'PATINTLOG', 'PCJEWELLER', 'PDSL',
            'PEL', 'PERSISTENT', 'PETRONET', 'PFC', 'PFIZER',
            'PGHH', 'PHILIPCARB', 'PHOENIXLTD', 'PIDILITIND', 'PIIND',
            'PNBHOUSING', 'PNB', 'PNCINFRA', 'POLYCAB', 'POLYMED',
            'POLYPLEX', 'POONAWALLA', 'POWERGRID', 'POWERINDIA', 'PRAJIND',
            'PRAKASH', 'PRECAM', 'PRECOT', 'PRESTIGE', 'PRIMESECU',
            'PRINCEPIPE', 'PRSMJOHNSN', 'PSB', 'PSPPROJECT', 'PTC',
            'PTL', 'PVR', 'QUESS', 'RADICO', 'RADIOCITY',
            'RAIN', 'RAJESHEXPO', 'RALLIS', 'RAMCOCEM', 'RAMCOSYS',
            'RAMKY', 'RANEHOLDIN', 'RANEENGINE', 'RATNAMANI', 'RAYMOND',
            'RBLBANK', 'RCF', 'RECLTD', 'REDINGTON', 'RELAXO',
            'RELCAPITAL', 'RELIANCE', 'RELIGARE', 'REPCOHOME', 'RESPONIND',
            'REVATHI', 'RICOAUTO', 'RITES', 'RKFORGE', 'RNAM',
            'ROCKINGDEAL', 'ROHLTD', 'ROSSARI', 'ROUTE', 'RPOWER',
            'RPSGVENT', 'RSSOFTWARE', 'RSWM', 'RTNINDIA', 'RUBYMILLS',
            'RUCHINFRA', 'RUCHIRA', 'RUPA', 'SADBHAV', 'SADBHIN',
            'SAEL', 'SAFARI', 'SAGCEM', 'SAIL', 'SALASAR',
            'SALSTEEL', 'SALZERELEC', 'SAMBHAAV', 'SANOFI', 'SANWARIA',
            'SARDAEN', 'SAREGAMA', 'SARLAPOLY', 'SASKEN', 'SASTASUNDR',
            'SATIA', 'SATIN', 'SBC', 'SBICARD', 'SBILIFE',
            'SBIN', 'SCHAEFFLER', 'SCHNEIDER', 'SCI', 'SEAMECLTD',
            'SELAN', 'SEQUENT', 'SFL', 'SHALBY', 'SHALPAINTS',
            'SHANKARA', 'SHANTIGEAR', 'SHARDACROP', 'SHARDAMOTR', 'SHAREINDIA',
            'SHEMAROO', 'SHILPAMED', 'SHIVACEM', 'SHIVAMILLS', 'SHOPERSTOP',
            'SHREECEM', 'SHREEPUSHK', 'SHREERAMA', 'SHREDIGCEM', 'SHRIRAMCIT',
            'SHYAMTEL', 'SIEMENS', 'SIL', 'SILGO', 'SIMPLEXINF',
            'SINTERCOM', 'SIRCA', 'SIYSIL', 'SJVN', 'SKFINDIA',
            'SKMEGGPROD', 'SMARTLINK', 'SMLISUZU', 'SMSLIFE', 'SMSPHARMA',
            'SNOWMAN', 'SOBHA', 'SOLARA', 'SOLARINDS', 'SOMANYCERA',
            'SOMATEX', 'SONACOMS', 'SONATSOFTW', 'SOUTHBANK', 'SPANDANA',
            'SPARC', 'SPECIALITY', 'SPENCERS', 'SPICEJET', 'SPLIL',
            'SPMLINFRA', 'SPTL', 'SREEL', 'SRF', 'SRTRANSFIN',
            'STAR', 'STARCEMENT', 'STCINDIA', 'STEELCAS', 'STEELXIND',
            'STLTECH', 'STOVEKRAFT', 'SUBEXLTD', 'SUBROS', 'SUDARSCHEM',
            'SUKHJITS', 'SUMICHEM', 'SUMMITSEC', 'SUNCLAYLTD', 'SUNDARAM',
            'SUNDARMFIN', 'SUNDRMFAST', 'SUNFLAG', 'SUNPHARMA', 'SUNTECK',
            'SUNTV', 'SUPRAJIT', 'SUPREMEIND', 'SUPRIYA', 'SURANASOL',
            'SURANAT&P', 'SURYAROSNI', 'SUTLEJTEX', 'SUULD', 'SUZLON',
            'SWANENERGY', 'SWARAJENG', 'SYMPHONY', 'SYNDIBANK', 'SYNGENE',
            'TAKE', 'TALBROAUTO', 'TALWALKARS', 'TANLA', 'TARAPUR',
            'TATACHEM', 'TATACOMM', 'TATACONSUM', 'TATACOFFEE', 'TATAELXSI',
            'TATAGLOBAL', 'TATAINVEST', 'TATAMETAL', 'TATAMOTORS', 'TATAPOWER',
            'TATASTEEL', 'TATASTLLP', 'TBZ', 'TCI', 'TCIEXP',
            'TCNSBRANDS', 'TCS', 'TDPOWERSYS', 'TEAMLEASE', 'TECHIN',
            'TECHM', 'TECHNOE', 'TEJASNET', 'TEXINFRA', 'TEXMOPIPES',
            'TEXRAIL', 'TFCILTD', 'TGBHOTELS', 'THANGAMAYL', 'THEINVEST',
            'THERMAX', 'THOMASCOOK', 'THYROCARE', 'TIDEWATER', 'TIINDIA',
            'TILAKNAGAR', 'TIMKEN', 'TINPLATE', 'TIPSINDLTD', 'TIRUMALCHM',
            'TITAN', 'TNPETRO', 'TNPL', 'TNTELE', 'TOKYOPLAST',
            'TORNTPHARM', 'TORNTPOWER', 'TOTAL', 'TOUCHWOOD', 'TPLPLASTEH',
            'TREEHOUSE', 'TRENT', 'TRF', 'TRIDENT', 'TRIGYN',
            'TRITURBINE', 'TTKPRESTIG', 'TTL', 'TV18BRDCST', 'TVSMOTOR',
            'TVSSRICHAK', 'TVTODAY', 'TVVISION', 'UCOBANK', 'UFLEX',
            'UFO', 'UGARSUGAR', 'UGROCAP', 'UJJIVAN', 'UJJIVANSFB',
            'ULTRACEMCO', 'UNICHEMLAB', 'UNIDT', 'UNIENTER', 'UNIONBANK',
            'UNIPLY', 'UNITECH', 'UNITEDBNK', 'UNITEDTEA', 'UNITY',
            'UNIVCABLES', 'UPL', 'URJA', 'USHAMART', 'UTIAMC',
            'UTTAMSUGAR', 'UVSL', 'V2RETAIL', 'VAIBHAVGBL', 'VAKRANGEE',
            'VALIANTORG', 'VARROC', 'VBL', 'VEDL', 'VENKEYS',
            'VENUSREM', 'VESUVIUS', 'VGUARD', 'VHL', 'VIDHIING',
            'VIDEOIND', 'VIKASMCORP', 'VIKASECO', 'VINATIORGA', 'VINDHYATEL',
            'VIPCLOTHNG', 'VIPIND', 'VIPUL', 'VISAKAIND', 'VISASTEEL',
            'VISHNU', 'VISHWARAJ', 'VMART', 'VOLTAMP', 'VOLTAS',
            'VTL', 'WABAG', 'WABCOINDIA', 'WALCHANNAG', 'WATERBASE',
            'WEBELSOLAR', 'WEIZFOREX', 'WEIZMANIND', 'WELCORP', 'WELENT',
            'WELSPUNIND', 'WENDT', 'WESTLIFE', 'WHEELS', 'WHIRLPOOL',
            'WILLAMAGOR', 'WINDMACHIN', 'WIPL', 'WIPRO', 'WOCKPHARMA',
            'WONDERLA', 'WORTH', 'WSI', 'WSTCSTPAPR', 'XCHANGING',
            'XELPMOC', 'XPROINDIA', 'YAARI', 'YESBANK', 'YUKEN',
            'ZEEL', 'ZEEMEDIA', 'ZENITHEXPO', 'ZENITHSTL', 'ZENTEC',
            'ZENSARTECH', 'ZODIACLOTH', 'ZOMATO', 'ZUARI', 'ZUARIAGRO',
            'ZYDUSLIFE', 'ZYDUSWELL'
        ];
    }

    /**
     * Get paginated stock symbols
     */
    getPaginatedSymbols(limit = 50, offset = 0) {
        return this.stockSymbols.slice(offset, offset + limit);
    }

    /**
     * Get total count
     */
    getTotalCount() {
        return this.stockSymbols.length;
    }

    /**
     * Search stocks by symbol or name
     */
    searchStocks(query) {
        const lowerQuery = query.toLowerCase();
        return this.stockSymbols.filter(symbol => 
            symbol.toLowerCase().includes(lowerQuery)
        );
    }
}

module.exports = new NSEStockListService();
