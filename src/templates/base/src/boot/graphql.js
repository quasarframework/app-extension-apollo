import { ApolloClient } from 'apollo-client'
import VueApollo from 'vue-apollo'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default ({ Vue, app }) => {
	const uri = process.env.API_END_POINT || 'http://localhost:3000/'
	const httpLink = new HttpLink({ uri })

	// Create the apollo client
	const defaultClient = new ApolloClient({
		link: httpLink,
		cache: new InMemoryCache()
	})

	const apolloProvider = new VueApollo({ defaultClient })

	Vue.use(VueApollo)
	app.apolloProvider = apolloProvider
	return apolloProvider
}
