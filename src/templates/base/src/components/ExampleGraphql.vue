<template>
  <div>
    {{allPosts[0].title}}
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    allPosts: gql`query {
      allPosts {
        title
        views
      }
    }`
  },
  data () {
    return {
      allPosts: [{}]
    }
  }
}
</script>
