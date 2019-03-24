<?php
require_once("Database.php");

class LanguageManager
{
    var $Translations = Array();
    var $Locale;

    var $ArrayTags = Array();
    var $ArrayTranslations = Array();
    var $ArrayTranslationsDefaultLanguage = Array();

    var $LoadedModule = null;
    var $ModuleArrayTags = Array();
    var $ModuleArrayTranslations = Array();
    var $ModuleArrayTranslationsDefaultLanguage = Array();

    public function __construct()
    {
        $this->ArrayTranslationsDefaultLanguage = Database::Language_LoadAllTranslations(Definitions::DefaultLocale);


//        if (isset($_REQUEST['Locale'])) {
//            if($_REQUEST['Locale'] == 'dev')
//                $_REQUEST['Locale'] = Definitions::DefaultLocale;
//            $this->SetLocale($_REQUEST['Locale']);
//        } else {
            if (isset($_COOKIE["i18next"]) and in_array($_COOKIE["i18next"],Database::Language_GetAvailableLocales())) {
                $this->SetLocale($_COOKIE["i18next"]);
            } else {
                $this->SetLocale(Definitions::DefaultLocale);
            }
//        }
    }

    public function GetLocale()
    {
        return $this->Locale;
    }

    public function SetLocale($Locale)
    {
        setcookie("i18next", $Locale);
        $this->Locale = $Locale;
        setlocale(LC_ALL, $this->Locale);
        $this->LoadTranslationTags();
    }

    public function GetHomepageTranslation($Tag)
    {
        return $this->GetTranslation('Homepage', $Tag);
    }

    public function ReplaceTags($String,$Module = null)
    {
        if($Module == null)
        {
            return str_replace($this->ArrayTags, $this->ArrayTranslations, $String);
        }
        else
        {
            $this->LoadTranslationTags($Module);
            return str_replace($this->ModuleArrayTags, $this->ModuleArrayTranslations, $String);
        }
    }

    public function LoadTranslationTags($Module = null)
    {
        if($Module == null)
        {
            $this->ArrayTags = Database::Language_LoadAllTags();
            $this->ArrayTranslations = Database::Language_LoadAllTranslations($this->Locale);

            foreach($this->ArrayTranslations as $index => $key)
                if ($key == "")
                    $this->ArrayTranslations[$index] = $this->ArrayTranslationsDefaultLanguage[$index];
//                    $this->ArrayTranslations[$index] = $this->ArrayTranslationsDefaultLanguage[$index]." [[MISSING TRANSLATION]]";
        }
        else
        {
            if($this->LoadedModule == null or $this->LoadedModule != $Module)
            {
                $this->LoadedModule = $Module;
                $this->ModuleArrayTags = Database::Language_LoadAllTags($Module);
                $this->ModuleArrayTranslations = Database::Language_LoadAllTranslations($this->Locale,$Module);
                $this->ModuleArrayTranslationsDefaultLanguage = Database::Language_LoadAllTranslations(Definitions::DefaultLocale,$Module);

                foreach($this->ModuleArrayTranslations as $index => $key)
                    if($key == "")
                        $this->ModuleArrayTranslations[$index] = $this->ModuleArrayTranslationsDefaultLanguage[$index]." [[MISSING TRANSLATION]]";
            }
        }
    }

    public function GetTranslation($Module, $Tag)
    {
        $Tag = strtoupper($Tag);

        if (!isset($this->Translations[$Module]))
            $this->Translations[$Module] = Database::Language_GetTranslations([$Module], $this->Locale);

        if (!isset($this->Translations[$Module][$Tag]) or $this->Translations[$Module][$Tag] == "") {
            return "???_" . ($Tag) . "_???";
        }

        return $this->Translations[$Module][$Tag];
    }

    public function GetModules()
    {
        return Database::Language_GetModules();
    }

    public function GetAvailableLocales()
    {
        return Database::Language_GetAvailableLocales();
    }

    public function GetTranslations($Module, $Locale)
    {
        return Database::Language_GetTranslations([$Module], $Locale);
    }

    public function GetLanguageCode($Locale)
    {
        return $this->GetLanguageCodes()[explode("_", $Locale)[0]];
    }

    public function GetLanguageCodeEN($Locale)
    {
        return $this->GetLanguageCodesEN()[explode("_", $Locale)[0]];
    }

    public function GetCountryCodes()
    {
        return array(
            'AF' => 'Afghanistan',
            'AX' => 'Aland Islands',
            'AL' => 'Albania',
            'DZ' => 'Algeria',
            'AS' => 'American Samoa',
            'AD' => 'Andorra',
            'AO' => 'Angola',
            'AI' => 'Anguilla',
            'AQ' => 'Antarctica',
            'AG' => 'Antigua And Barbuda',
            'AR' => 'Argentina',
            'AM' => 'Armenia',
            'AW' => 'Aruba',
            'AU' => 'Australia',
            'AT' => 'Austria',
            'AZ' => 'Azerbaijan',
            'BS' => 'Bahamas',
            'BH' => 'Bahrain',
            'BD' => 'Bangladesh',
            'BB' => 'Barbados',
            'BY' => 'Belarus',
            'BE' => 'Belgium',
            'BZ' => 'Belize',
            'BJ' => 'Benin',
            'BM' => 'Bermuda',
            'BT' => 'Bhutan',
            'BO' => 'Bolivia',
            'BA' => 'Bosnia And Herzegovina',
            'BW' => 'Botswana',
            'BV' => 'Bouvet Island',
            'BR' => 'Brazil',
            'IO' => 'British Indian Ocean Territory',
            'BN' => 'Brunei Darussalam',
            'BG' => 'Bulgaria',
            'BF' => 'Burkina Faso',
            'BI' => 'Burundi',
            'KH' => 'Cambodia',
            'CM' => 'Cameroon',
            'CA' => 'Canada',
            'CV' => 'Cape Verde',
            'KY' => 'Cayman Islands',
            'CF' => 'Central African Republic',
            'TD' => 'Chad',
            'CL' => 'Chile',
            'CN' => 'China',
            'CX' => 'Christmas Island',
            'CC' => 'Cocos (Keeling) Islands',
            'CO' => 'Colombia',
            'KM' => 'Comoros',
            'CG' => 'Congo',
            'CD' => 'Congo, Democratic Republic',
            'CK' => 'Cook Islands',
            'CR' => 'Costa Rica',
            'CI' => 'Cote D\'Ivoire',
            'HR' => 'Croatia',
            'CU' => 'Cuba',
            'CY' => 'Cyprus',
            'CZ' => 'Czech Republic',
            'DK' => 'Denmark',
            'DJ' => 'Djibouti',
            'DM' => 'Dominica',
            'DO' => 'Dominican Republic',
            'EC' => 'Ecuador',
            'EG' => 'Egypt',
            'SV' => 'El Salvador',
            'GQ' => 'Equatorial Guinea',
            'ER' => 'Eritrea',
            'EE' => 'Estonia',
            'ET' => 'Ethiopia',
            'FK' => 'Falkland Islands (Malvinas)',
            'FO' => 'Faroe Islands',
            'FJ' => 'Fiji',
            'FI' => 'Finland',
            'FR' => 'France',
            'GF' => 'French Guiana',
            'PF' => 'French Polynesia',
            'TF' => 'French Southern Territories',
            'GA' => 'Gabon',
            'GM' => 'Gambia',
            'GE' => 'Georgia',
            'DE' => 'Germany',
            'GH' => 'Ghana',
            'GI' => 'Gibraltar',
            'GR' => 'Greece',
            'GL' => 'Greenland',
            'GD' => 'Grenada',
            'GP' => 'Guadeloupe',
            'GU' => 'Guam',
            'GT' => 'Guatemala',
            'GG' => 'Guernsey',
            'GN' => 'Guinea',
            'GW' => 'Guinea-Bissau',
            'GY' => 'Guyana',
            'HT' => 'Haiti',
            'HM' => 'Heard Island & Mcdonald Islands',
            'VA' => 'Holy See (Vatican City State)',
            'HN' => 'Honduras',
            'HK' => 'Hong Kong',
            'HU' => 'Hungary',
            'IS' => 'Iceland',
            'IN' => 'India',
            'ID' => 'Indonesia',
            'IR' => 'Iran, Islamic Republic Of',
            'IQ' => 'Iraq',
            'IE' => 'Ireland',
            'IM' => 'Isle Of Man',
            'IL' => 'Israel',
            'IT' => 'Italy',
            'JM' => 'Jamaica',
            'JP' => 'Japan',
            'JE' => 'Jersey',
            'JO' => 'Jordan',
            'KZ' => 'Kazakhstan',
            'KE' => 'Kenya',
            'KI' => 'Kiribati',
            'KR' => 'Korea',
            'KW' => 'Kuwait',
            'KG' => 'Kyrgyzstan',
            'LA' => 'Lao People\'s Democratic Republic',
            'LV' => 'Latvia',
            'LB' => 'Lebanon',
            'LS' => 'Lesotho',
            'LR' => 'Liberia',
            'LY' => 'Libyan Arab Jamahiriya',
            'LI' => 'Liechtenstein',
            'LT' => 'Lithuania',
            'LU' => 'Luxembourg',
            'MO' => 'Macao',
            'MK' => 'Macedonia',
            'MG' => 'Madagascar',
            'MW' => 'Malawi',
            'MY' => 'Malaysia',
            'MV' => 'Maldives',
            'ML' => 'Mali',
            'MT' => 'Malta',
            'MH' => 'Marshall Islands',
            'MQ' => 'Martinique',
            'MR' => 'Mauritania',
            'MU' => 'Mauritius',
            'YT' => 'Mayotte',
            'MX' => 'Mexico',
            'FM' => 'Micronesia, Federated States Of',
            'MD' => 'Moldova',
            'MC' => 'Monaco',
            'MN' => 'Mongolia',
            'ME' => 'Montenegro',
            'MS' => 'Montserrat',
            'MA' => 'Morocco',
            'MZ' => 'Mozambique',
            'MM' => 'Myanmar',
            'NA' => 'Namibia',
            'NR' => 'Nauru',
            'NP' => 'Nepal',
            'NL' => 'Netherlands',
            'AN' => 'Netherlands Antilles',
            'NC' => 'New Caledonia',
            'NZ' => 'New Zealand',
            'NI' => 'Nicaragua',
            'NE' => 'Niger',
            'NG' => 'Nigeria',
            'NU' => 'Niue',
            'NF' => 'Norfolk Island',
            'MP' => 'Northern Mariana Islands',
            'NO' => 'Norway',
            'OM' => 'Oman',
            'PK' => 'Pakistan',
            'PW' => 'Palau',
            'PS' => 'Palestinian Territory, Occupied',
            'PA' => 'Panama',
            'PG' => 'Papua New Guinea',
            'PY' => 'Paraguay',
            'PE' => 'Peru',
            'PH' => 'Philippines',
            'PN' => 'Pitcairn',
            'PL' => 'Poland',
            'PT' => 'Portugal',
            'PR' => 'Puerto Rico',
            'QA' => 'Qatar',
            'RE' => 'Reunion',
            'RO' => 'Romania',
            'RU' => 'Russian Federation',
            'RW' => 'Rwanda',
            'BL' => 'Saint Barthelemy',
            'SH' => 'Saint Helena',
            'KN' => 'Saint Kitts And Nevis',
            'LC' => 'Saint Lucia',
            'MF' => 'Saint Martin',
            'PM' => 'Saint Pierre And Miquelon',
            'VC' => 'Saint Vincent And Grenadines',
            'WS' => 'Samoa',
            'SM' => 'San Marino',
            'ST' => 'Sao Tome And Principe',
            'SA' => 'Saudi Arabia',
            'SN' => 'Senegal',
            'RS' => 'Serbia',
            'SC' => 'Seychelles',
            'SL' => 'Sierra Leone',
            'SG' => 'Singapore',
            'SK' => 'Slovakia',
            'SI' => 'Slovenia',
            'SB' => 'Solomon Islands',
            'SO' => 'Somalia',
            'ZA' => 'South Africa',
            'GS' => 'South Georgia And Sandwich Isl.',
            'ES' => 'Spain',
            'LK' => 'Sri Lanka',
            'SD' => 'Sudan',
            'SR' => 'Suriname',
            'SJ' => 'Svalbard And Jan Mayen',
            'SZ' => 'Swaziland',
            'SE' => 'Sweden',
            'CH' => 'Switzerland',
            'SY' => 'Syrian Arab Republic',
            'TW' => 'Taiwan',
            'TJ' => 'Tajikistan',
            'TZ' => 'Tanzania',
            'TH' => 'Thailand',
            'TL' => 'Timor-Leste',
            'TG' => 'Togo',
            'TK' => 'Tokelau',
            'TO' => 'Tonga',
            'TT' => 'Trinidad And Tobago',
            'TN' => 'Tunisia',
            'TR' => 'Turkey',
            'TM' => 'Turkmenistan',
            'TC' => 'Turks And Caicos Islands',
            'TV' => 'Tuvalu',
            'UG' => 'Uganda',
            'UA' => 'Ukraine',
            'AE' => 'United Arab Emirates',
            'GB' => 'United Kingdom',
            'US' => 'United States',
            'UM' => 'United States Outlying Islands',
            'UY' => 'Uruguay',
            'UZ' => 'Uzbekistan',
            'VU' => 'Vanuatu',
            'VE' => 'Venezuela',
            'VN' => 'Viet Nam',
            'VG' => 'Virgin Islands, British',
            'VI' => 'Virgin Islands, U.S.',
            'WF' => 'Wallis And Futuna',
            'EH' => 'Western Sahara',
            'YE' => 'Yemen',
            'ZM' => 'Zambia',
            'ZW' => 'Zimbabwe',
        );
    }

    public function GetLanguageCodes()
    {
        return array(
            'ab' => 'аҧсуа',
            'aa' => 'Afaraf',
            'af' => 'Afrikaans',
            'ak' => 'Akan',
            'sq' => 'Shqip',
            'am' => 'አማርኛ',
            'ar' => 'العربية',
            'an' => 'aragonés',
            'hy' => 'Հայերեն',
            'as' => 'অসমীয়া',
            'av' => 'авар',
            'ae' => 'avesta',
            'ay' => 'aymar',
            'az' => 'azərbaycan',
            'bm' => 'bamanankan',
            'ba' => 'башҡорт',
            'eu' => 'euskara',
            'be' => 'беларуская',
            'bn' => 'বাংলা',
            'bh' => 'भोजपुरी',
            'bi' => 'Bislama',
            'bs' => 'bosanski',
            'br' => 'brezhoneg',
            'bg' => 'български',
            'my' => 'ဗမာစာ',
            'ca' => 'catalç',
            'ch' => 'Chamoru',
            'ce' => 'нохчийн',
            'ny' => 'chiCheŵa',
            'zh' => '中文',
            'cv' => 'чӑваш',
            'kw' => 'Kernewek',
            'co' => 'corsu',
            'cr' => 'ᓀᐦᐃᔭᐍᐏᐣ',
            'hr' => 'hrvatski',
            'cs' => 'čeština',
            'da' => 'dansk',
            'dv' => 'ދިވެހި',
            'nl' => 'Nederlands',
            'dz' => 'རྫོང་ཁ',
            'en' => 'English',
            'eo' => 'Esperanto',
            'et' => 'eesti',
            'ee' => 'Eʋegbe',
            'fo' => 'føroyskt',
            'fj' => 'vosa',
            'fi' => 'suomi',
            'fr' => 'français',
            'ff' => 'Fulfulde',
            'gl' => 'galego',
            'ka' => 'ქართული',
            'de' => 'Deutsch',
            'el' => 'ελληνικά',
            'gn' => 'Avañe\'ẽ',
            'gu' => 'ગુજરાતી',
            'ht' => 'Kreyòl',
            'ha' => '(Hausa)',
            'he' => 'עברית',
            'hz' => 'Otjiherero',
            'hi' => 'हिन्दी',
            'ho' => 'Hiri',
            'hu' => 'magyar',
            'ia' => 'Interlingua',
            'id' => 'Bahasa',
            'ie' => 'Originally',
            'ga' => 'Gaeilge',
            'ig' => 'Asụsụ',
            'ik' => 'Iñupiaq',
            'io' => 'Ido',
            'is' => 'Íslenska',
            'it' => 'italiano',
            'iu' => 'ᐃᓄᒃᑎᑐᑦ',
            'ja' => '日本語',
            'jv' => 'basa',
            'kl' => 'kalaallisut',
            'kn' => 'ಕನ್ನಡ',
            'kr' => 'Kanuri',
            'ks' => 'कश्मीरी',
            'kk' => 'қазақ',
            'km' => 'ខ្មែរ',
            'ki' => 'Gĩkũyũ',
            'rw' => 'Ikinyarwanda',
            'ky' => 'Кыргызча',
            'kv' => 'коми',
            'kg' => 'Kikongo',
            'ko' => '한국어',
            'ku' => 'Kurdî',
            'kj' => 'Kuanyama',
            'la' => 'latine',
            'lb' => 'Lëtzebuergesch',
            'lg' => 'Luganda',
            'li' => 'Limburgs',
            'ln' => 'Lingála',
            'lo' => 'ພາສາລາວ',
            'lt' => 'lietuvių',
            'lu' => 'Tshiluba',
            'lv' => 'latviešu',
            'gv' => 'Gaelg',
            'mk' => 'македонски',
            'mg' => 'fiteny',
            'ms' => 'bahasa',
            'ml' => 'മലയാളം',
            'mt' => 'Malti',
            'mi' => 'te',
            'mr' => 'मराठी',
            'mh' => 'Kajin',
            'mn' => 'монгол',
            'na' => 'Ekakairũ',
            'nv' => 'Diné',
            'nd' => 'isiNdebele',
            'ne' => 'नेपाली',
            'ng' => 'Owambo',
            'nb' => 'Norsk',
            'nn' => 'Norsk',
            'no' => 'Norsk',
            'ii' => 'ꆈꌠ꒿',
            'nr' => 'isiNdebele',
            'oc' => 'occitan',
            'oj' => 'ᐊᓂᔑᓈᐯᒧᐎᓐ',
            'cu' => 'ѩзыкъ',
            'om' => 'Afaan',
            'or' => 'ଓଡ଼ିଆ',
            'os' => 'ирон',
            'pa' => 'ਪੰਜਾਬੀ',
            'pi' => 'पाऴि',
            'fa' => 'فارسی',
            'pl' => 'język',
            'ps' => 'پښتو',
            'pt' => 'português',
            'qu' => 'Runa',
            'rm' => 'rumantsch',
            'rn' => 'Ikirundi',
            'ro' => 'limba',
            'ru' => 'русский',
            'sa' => 'संस्कृतम्',
            'sc' => 'sardu',
            'sd' => 'सिन्धी',
            'se' => 'Davvisámegiella',
            'sm' => 'gagana',
            'sg' => 'yângâ',
            'sr' => 'српски',
            'gd' => 'Gàidhlig',
            'sn' => 'chiShona',
            'si' => 'සිංහල',
            'sk' => 'slovenčina',
            'sl' => 'slovenski',
            'so' => 'Soomaaliga',
            'st' => 'Sesotho',
            'es' => 'español',
            'su' => 'Basa',
            'sw' => 'Kiswahili',
            'ss' => 'SiSwati',
            'sv' => 'Svenska',
            'ta' => 'தமிழ்',
            'te' => 'తెలుగు',
            'tg' => 'тоҷикӣ',
            'th' => 'ไทย',
            'ti' => 'ትግርኛ',
            'bo' => 'བོད་ཡིག',
            'tk' => 'Türkmen',
            'tl' => 'Wikang',
            'tn' => 'Setswana',
            'to' => 'faka',
            'tr' => 'Türkçe',
            'ts' => 'Xitsonga',
            'tt' => 'татар',
            'tw' => 'Twi',
            'ty' => 'Reo',
            'ug' => 'Uyƣurqə',
            'uk' => 'українська',
            'ur' => 'اردو',
            'uz' => 'O‘zbek',
            've' => 'Tshivenḓa',
            'vi' => 'Tiếng',
            'vo' => 'Volapük',
            'wa' => 'walon',
            'cy' => 'Cymraeg',
            'wo' => 'Wollof',
            'fy' => 'Frysk',
            'xh' => 'isiXhosa',
            'yi' => 'ייִדיש',
            'yo' => 'Yorùbá',
            'za' => 'Saɯ',
            'zu' => 'isiZulu'
        );
    }

    public function GetLanguageCodesEN()
    {
        return array(
            'aa' => 'Afar',
            'ab' => 'Abkhaz',
            'ae' => 'Avestan',
            'af' => 'Afrikaans',
            'ak' => 'Akan',
            'am' => 'Amharic',
            'an' => 'Aragonese',
            'ar' => 'Arabic',
            'as' => 'Assamese',
            'av' => 'Avaric',
            'ay' => 'Aymara',
            'az' => 'Azerbaijani',
            'ba' => 'Bashkir',
            'be' => 'Belarusian',
            'bg' => 'Bulgarian',
            'bh' => 'Bihari',
            'bi' => 'Bislama',
            'bm' => 'Bambara',
            'bn' => 'Bengali',
            'bo' => 'Tibetan',
            'br' => 'Breton',
            'bs' => 'Bosnian',
            'ca' => 'Catalan',
            'ce' => 'Chechen',
            'ch' => 'Chamorro',
            'co' => 'Corsican',
            'cr' => 'Cree',
            'cs' => 'Czech',
            'cu' => 'Church Slavic',
            'cv' => 'Chuvash',
            'cy' => 'Welsh',
            'da' => 'Danish',
            'de' => 'German',
            'dv' => 'Maldivian',
            'dz' => 'Dzongkha',
            'ee' => 'Ewe',
            'el' => 'Greek, Modern',
            'en' => 'English',
            'eo' => 'Esperanto',
            'es' => 'Spain',
            'et' => 'Estonian',
            'eu' => 'Basque',
            'fa' => 'Persian',
            'ff' => 'Fula',
            'fi' => 'Finnish',
            'fj' => 'Fijian',
            'fo' => 'Faroese',
            'fr' => 'French',
            'fy' => 'Western Frisian',
            'ga' => 'Irish',
            'gd' => 'Scottish Gaelic',
            'gl' => 'Galician',
            'gn' => 'Guaraní',
            'gu' => 'Gujarati',
            'gv' => 'Manx',
            'ha' => 'Hausa',
            'he' => 'Hebrew',
            'hi' => 'Hindi',
            'ho' => 'Hiri Motu',
            'hr' => 'Croatian',
            'ht' => 'Haitian',
            'hu' => 'Hungarian',
            'hy' => 'Armenian',
            'hz' => 'Herero',
            'ia' => 'Interlingua',
            'id' => 'Indonesian',
            'ie' => 'Interlingue',
            'ig' => 'Igbo',
            'ii' => 'Nuosu',
            'ik' => 'Inupiaq',
            'io' => 'Ido',
            'is' => 'Icelandic',
            'it' => 'Italian',
            'iu' => 'Inuktitut',
            'ja' => 'Japanese (ja)',
            'jv' => 'Javanese (jv)',
            'ka' => 'Georgian',
            'kg' => 'Kongo',
            'ki' => 'Kikuyu',
            'kj' => 'Kwanyama',
            'kk' => 'Kazakh',
            'kl' => 'Kalaallisut',
            'km' => 'Khmer',
            'kn' => 'Kannada',
            'ko' => 'Korean',
            'kr' => 'Kanuri',
            'ks' => 'Kashmiri',
            'ku' => 'Kurdish',
            'kv' => 'Komi',
            'kw' => 'Cornish',
            'ky' => 'Kirghiz',
            'la' => 'Latin',
            'lb' => 'Luxembourgish',
            'lg' => 'Luganda',
            'li' => 'Limburgish',
            'ln' => 'Lingala',
            'lo' => 'Lao',
            'lt' => 'Lithuanian',
            'lu' => 'Luba-Katanga',
            'lv' => 'Latvian',
            'mg' => 'Malagasy',
            'mh' => 'Marshallese',
            'mi' => 'Maori',
            'mk' => 'Macedonian',
            'ml' => 'Malayalam',
            'mn' => 'Mongolian',
            'mr' => 'Marathi',
            'ms' => 'Malay',
            'mt' => 'Maltese',
            'my' => 'Burmese',
            'na' => 'Nauru',
            'nb' => 'Norwegian Bokmål',
            'nd' => 'North Ndebele',
            'ne' => 'Nepali',
            'ng' => 'Ndonga',
            'nl' => 'Dutch',
            'nn' => 'Norwegian Nynorsk',
            'no' => 'Norwegian',
            'nr' => 'South Ndebele',
            'nv' => 'Navajo, Navaho',
            'ny' => 'Chichewa',
            'oc' => 'Occitan',
            'oj' => 'Ojibwe',
            'om' => 'Oromo',
            'or' => 'Oriya',
            'os' => 'Ossetian',
            'pa' => 'Panjabi',
            'pi' => 'Pali',
            'pl' => 'Polish',
            'ps' => 'Pashto',
            'pt' => 'Portuguese',
            'qu' => 'Quechua',
            'rm' => 'Romansh',
            'rn' => 'Kirundi',
            'ro' => 'Romanian',
            'ru' => 'Russian',
            'rw' => 'Kinyarwanda',
            'sa' => 'Sanskrit',
            'sc' => 'Sardinian',
            'sd' => 'Sindhi',
            'se' => 'Northern Sami',
            'sg' => 'Sango',
            'si' => 'Sinhala',
            'sk' => 'Slovak',
            'sl' => 'Slovene',
            'sm' => 'Samoan',
            'sn' => 'Shona',
            'so' => 'Somali',
            'sq' => 'Albanian',
            'sr' => 'Serbian',
            'ss' => 'Swati',
            'st' => 'Southern Sotho',
            'su' => 'Sundanese',
            'sv' => 'Swedish',
            'sw' => 'Swahili',
            'ta' => 'Tamil',
            'te' => 'Telugu',
            'tg' => 'Tajik',
            'th' => 'Thai',
            'ti' => 'Tigrinya',
            'tk' => 'Turkmen',
            'tl' => 'Tagalog',
            'tn' => 'Tswana',
            'to' => 'Tonga',
            'tr' => 'Turkish',
            'ts' => 'Tsonga',
            'tt' => 'Tatar',
            'tw' => 'Twi',
            'ty' => 'Tahitian',
            'ug' => 'Uighur',
            'uk' => 'Ukrainian',
            'ur' => 'Urdu',
            'uz' => 'Uzbek',
            've' => 'Venda',
            'vi' => 'Vietnamese',
            'vo' => 'Volapük',
            'wa' => 'Walloon',
            'wo' => 'Wolof',
            'xh' => 'Xhosa',
            'yi' => 'Yiddish',
            'yo' => 'Yoruba',
            'za' => 'Zhuang',
            'zh' => 'Chinese',
            'zu' => 'Zulu',
        );
    }
}
