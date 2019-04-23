import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import fetch from 'node-fetch'

function service(url) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          )
        if (networkError) console.log(`[Network error]: ${networkError}`)
      }),
      new HttpLink({
        uri: url,
        credentials: 'same-origin',
        fetch,
        headers: {
          auth: process.env.MAIL_SERVICE_PASSWORD
        }
      })
    ]),
    cache: new InMemoryCache()
  })
}

export const mail = service(process.env.NODE_ENV === 'development'
  ? 'http://localhost:9000' : 'https://mail.api.productcube.io')