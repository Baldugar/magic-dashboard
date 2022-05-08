import gql from 'graphql-tag'

export default gql`
    mutation UpdateUserCardMeta($input: UpdateUserCardMetaInput!) {
        updateUserCardMeta(input: $input) {
            card {
                card_faces {
                    color_indicator
                    colors
                    flavor_text
                    loyalty
                    mana_cost
                    name
                    oracle_text
                    power
                    toughness
                    type_line
                }
                cmc
                color_identity
                colors
                flavor_text
                id
                image_uris {
                    small
                    normal
                    large
                    png
                    art_crop
                    border_crop
                }
                layout
                legalities {
                    alchemy
                    brawl
                    historic
                    historicbrawl
                    standard
                }
                loyalty
                mana_cost
                name
                oracle_text
                power
                produced_mana
                rarity
                released_at
                rulings_uri
                scryfall_uri
                set
                set_name
                set_uri
                toughness
                type_line
            }
            rating
            comment
            userCardTags {
                tag {
                    id
                    type
                    extra
                    colors
                    categoryType
                }
                rating
                comment
            }
            userDeckTags {
                rating
                comment
                tag {
                    id
                    type
                    extra
                    colors
                    categoryType
                }
            }
        }
    }
`
