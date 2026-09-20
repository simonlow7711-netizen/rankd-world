export type LocationConfig = {

  name:string

  city:string

  country:string

  cityLevel?:boolean

}


export const locations:Record<
  string,
  LocationConfig
> = {

  poblacion: {

    name:
      "Poblacion",

    city:
      "Makati",

    country:
      "Philippines"

  },

  islington: {

    name:
      "Islington",

    city:
      "London",

    country:
      "United Kingdom"

  },

  williamsburg: {

    name:
      "Williamsburg",

    city:
      "New York",

    country:
      "United States"

  },

  leeds: {

    name:
      "Leeds",

    city:
      "Leeds",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  sheffield: {

    name:
      "Sheffield",

    city:
      "Sheffield",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  dundee: {

    name:
      "Dundee",

    city:
      "Dundee",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  middlesbrough: {

    name:
      "Middlesbrough",

    city:
      "Middlesbrough",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  "stoke-on-trent": {

    name:
      "Stoke-on-Trent",

    city:
      "Stoke-on-Trent",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  derry: {

    name:
      "Derry",

    city:
      "Derry",

    country:
      "United Kingdom",

    cityLevel:
      true

  },

  swansea: {

    name:
      "Swansea",

    city:
      "Swansea",

    country:
      "United Kingdom",

    cityLevel:
      true

  }

}