import gql from 'graphql-tag'

export default gql`
    mutation AddTag($tag: TagInput!) {
        addTag(tag: $tag) {
            id
            type
            extra
            colors
            categoryType
        }
    }
`
