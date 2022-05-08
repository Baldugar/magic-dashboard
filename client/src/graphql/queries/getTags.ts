import gql from 'graphql-tag'

export default gql`
    query GetTags {
        getTags {
            cardTags {
                id
                type
                extra
                categoryType
                colors
            }
            deckTags {
                id
                type
                extra
                colors
                categoryType
            }
        }
    }
`
