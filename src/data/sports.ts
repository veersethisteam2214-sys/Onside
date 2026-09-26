import type { Sport, Suburb } from '../types'

export const SPORTS: Sport[] = [
  {
    id: 'athletics',
    name: 'Athletics',
    skills: ['Long jump', 'Sprint starts', 'Hurdles', 'Shot put', 'Middle distance'],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    skills: ['First touch', 'Finishing', '1v1 defending', 'Goalkeeping', 'Crossing'],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    skills: ['Serve', 'Backhand', 'Footwork', 'Volleys', 'Match strategy'],
  },
  {
    id: 'padel',
    name: 'Padel',
    skills: ['Bandeja', 'Wall play', 'Serve & return', 'Volleys', 'Positioning'],
  },
  {
    id: 'boxing',
    name: 'Boxing',
    skills: ['Footwork', 'Combinations', 'Defence', 'Conditioning'],
  },
  {
    id: 'swimming',
    name: 'Swimming',
    skills: ['Freestyle technique', 'Starts & turns', 'Butterfly', 'Breaststroke', 'Endurance'],
  },
]

export const sportById = (id: string) => SPORTS.find((s) => s.id === id)!

/** Approximate suburb centroids — good enough for distance ranking in a demo. */
export const SUBURBS: Suburb[] = [
  { name: 'Burwood', lat: -37.851, lng: 145.114 },
  { name: 'Box Hill', lat: -37.819, lng: 145.125 },
  { name: 'Glen Waverley', lat: -37.878, lng: 145.165 },
  { name: 'Camberwell', lat: -37.842, lng: 145.071 },
  { name: 'Hawthorn', lat: -37.822, lng: 145.035 },
  { name: 'Doncaster', lat: -37.787, lng: 145.124 },
  { name: 'Clayton', lat: -37.925, lng: 145.12 },
  { name: 'Richmond', lat: -37.823, lng: 144.998 },
  { name: 'Carlton', lat: -37.8, lng: 144.967 },
  { name: 'Brunswick', lat: -37.767, lng: 144.96 },
  { name: 'St Kilda', lat: -37.868, lng: 144.98 },
  { name: 'Footscray', lat: -37.8, lng: 144.9 },
]

export const suburbByName = (name: string) => SUBURBS.find((s) => s.name === name)!
