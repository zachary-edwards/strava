interface AccessTokenRequest {
  token_type: string, 
  expires_at: number,
  expires_in: number,
  refresh_token: string,
  access_token, string,
  athlete: AtheleteTokenRequest
}

interface AtheleteTokenRequest {
  id: number,
  username: string,
  resource_state: number,
  firstname: string,
  lastname: string,
  bio: string,
  city: string,
  state: string,
  country: string,
  sex: string,
  premium: boolean,
  summit: boolean,
  created_at: Date,
  updated_at: Date,
  badge_type_id: number,
  weight: number,
  profile_medium: string,
  profile: string,
  friend: any,
  follower: any
}

export { AccessTokenRequest, AtheleteTokenRequest }