# Retrofit

Retrofit is a type-safe HTTP client for Android and Java developed by Square. It makes it exceptionally easy to consume JSON or XML APIs by mapping endpoints to Kotlin interfaces.

## Core Concepts

### 1. API Interface
You describe HTTP endpoints using annotations on an interface.
```kotlin
interface ApiService {
    @GET("users/{user}/repos")
    suspend fun listRepos(@Path("user") user: String): List<Repo>

    @POST("users/new")
    suspend fun createUser(@Body user: UserDto): Response<UserDto>
}
```

### 2. Building the Client
You instantiate the service interface via `Retrofit.Builder`. This relies heavily on OkHttp under the hood.
```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.github.com/")
    .addConverterFactory(GsonConverterFactory.create()) // or Moshi/Kotlinx Serialization
    .build()

val service = retrofit.create(ApiService::class.java)
```

### 3. Converters
Retrofit does not serialize JSON automatically. It requires a converter.
- **Moshi:** Modern, Kotin-friendly, highly recommended.
- **Kotlin Serialization:** Official JetBrains library, works great with Compose/KMP.
- **Gson:** Legacy, relies heavily on reflection. Try to avoid in new apps.

## Best Practices (OkHttp Interceptors)

OkHttp interceptors sit between your app and the network. They are essential for modifying requests globally.

### 1. Auth Interceptor (Adding Tokens)
```kotlin
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer ${tokenManager.getToken()}")
            .build()
        return chain.proceed(request)
    }
}
```

### 2. Authenticator (Refreshing Tokens on 401)
If a token expires, an `Authenticator` can automatically catch the `401 Unauthorized` response, fetch a new token, and automatically retry the original request.
```kotlin
class TokenAuthenticator(...) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        // This is called automatically when the API returns a 401.
        val newToken = fetchNewTokenSynchronously() ?: return null
        return response.request.newBuilder()
            .header("Authorization", "Bearer $newToken")
            .build()
    }
}
```

### 3. Logging Interceptor
Always use `HttpLoggingInterceptor` in `DEBUG` builds to see network traffic in Logcat. Ensure it is stripped out in `RELEASE` builds to prevent sensitive data leaks.

## Interview Questions

**Q: Do you need to run Retrofit `suspend` functions on `Dispatchers.IO`?**
*Answer:* No. Retrofit natively supports Kotlin Coroutines. Under the hood, Retrofit’s internal implementation automatically routes network requests onto OkHttp’s background thread pool. Calling a Retrofit `suspend` function on `Dispatchers.Main` is perfectly safe and won't block the UI.

**Q: How do you handle dynamic URLs in Retrofit?**
*Answer:* You can use the `@Url` annotation inside the interface method, overriding the default base URL for that specific request.
```kotlin
@GET
suspend fun fetchProfilePicture(@Url fullUrl: String): ResponseBody
```
