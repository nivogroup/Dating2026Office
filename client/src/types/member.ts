export type Member =  {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActive: string
  gender: string
  description?: string
  city: string
  country: string
}

export type Photo = {
  id: number
  url: string
  publicId?: string
  memberId: string
}

// Has been created for the Edit a member profile
export type EditableMember = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}

