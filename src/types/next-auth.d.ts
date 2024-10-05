import "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        id: string,
        name: string,
        email: string, 
        image: string,
        credits : int,
        twitterConnected : boolean
        githubStarred : boolean
        bonusCreditsClaimed : boolean
      } & DefaultSession["user"]
    }
  
    interface User {
      id: string,
      name: string,
      email: string, 
      image: string
      credits : int,
      twitterConnected : boolean
      githubStarred : boolean
      bonusCreditsClaimed : boolean
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string,
      name: string,
      email: string, 
      image: string
      credits : int,
      twitterConnected : boolean
      githubStarred : boolean
      bonusCreditsClaimed : boolean
    }
  }