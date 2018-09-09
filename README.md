# Signup `POST /auth/signup`

#### Body                                     

| Name          | Type          |
| ------------- |-------------| 
| `userName`      | String | 
| `password`      | String      
| `name` | String      | 
|`profilePic`|String|
|`gender`|String|
|`sexualOrientation`|String
|`bio`|String
|'ethnicity'|String

#### Response
Success - The User object that was inserted into the database


# Login `POST /auth/login`

#### Body

|Name|Type
|---|---
|`userName`|String
|`password`|String

#### Response
Success - The JWT token to save and use for all other requests that requre authentication

# Get User `GET /auth/getUser`

#### Headers

|Header Field|Value
|---|---
|`'Authorization'`|JWT token

#### Response
Success - The User object that corresponds to the token provided
