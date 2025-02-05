export interface Endorsements {
  instances: {
    domain: string
    endorsement_reasons: string[]
  }[]
}

export interface Hesitations {
  instances: {
    domain: string
    hesitation_reasons: string[]
  }[]
}

export interface Censures {
  instances: {
    domain: string
    censure_reasons: string[]
  }[]
}

export interface Guarantees {
  instances: {
    domain: string
    guarantee_reasons: string[]
  }[]
}

export interface Data {
  endorsements: Endorsements
  hesitations: Hesitations
  guarantees: Guarantees
  censures: Censures
}

class Fediseer {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async getInstanceInfo(domain: string): Promise<Data> {
    const [endorsements, hesitations, guarantees, censures] = await Promise.all(
      [
        fetch(`${this.url}/v1/endorsements/${domain}`).then((r) =>
          r.json(),
        ) as Promise<Endorsements>,
        fetch(`${this.url}/v1/hesitations/${domain}`).then((r) =>
          r.json(),
        ) as Promise<Hesitations>,
        fetch(`${this.url}/v1/guarantees/${domain}`).then((r) =>
          r.json(),
        ) as Promise<Guarantees>,
        fetch(`${this.url}/v1/censures/${domain}`).then((r) =>
          r.json(),
        ) as Promise<Censures>,
      ],
    )

    return { endorsements, hesitations, guarantees, censures }
  }
}

export const fediseer = new Fediseer('https://fediseer.com/api')
