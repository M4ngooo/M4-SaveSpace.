import type { AppData } from '../types'

const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString()
const monthsFromNow = (n: number) => {
  const d = new Date(now)
  d.setMonth(d.getMonth() + n)
  return d.toISOString().split('T')[0]
}

export const SEED_DATA: AppData = {
  demoDataLoaded: true,
  goals: [
    {
      id: 'goal-1',
      name: 'Wakacje',
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: monthsFromNow(6),
      icon: '🌴',
      description: 'Wymarzone wakacje nad morzem',
      createdAt: daysAgo(90),
    },
    {
      id: 'goal-2',
      name: 'Nowy iPhone',
      targetAmount: 5000,
      currentAmount: 2400,
      deadline: monthsFromNow(4),
      icon: '📱',
      createdAt: daysAgo(60),
    },
    {
      id: 'goal-3',
      name: 'Samochód',
      targetAmount: 30000,
      currentAmount: 12500,
      deadline: monthsFromNow(18),
      icon: '🚗',
      description: 'Wkład własny na nowy samochód',
      createdAt: daysAgo(120),
    },
    {
      id: 'goal-4',
      name: 'Poduszka finansowa',
      targetAmount: 10000,
      currentAmount: 10000,
      icon: '🛡️',
      createdAt: daysAgo(200),
      completedAt: daysAgo(10),
    },
    {
      id: 'goal-5',
      name: 'Nowy komputer',
      targetAmount: 7000,
      currentAmount: 7000,
      icon: '💻',
      createdAt: daysAgo(150),
      completedAt: daysAgo(30),
    },
  ],
  transactions: [
    { id: 'tx-1', goalId: 'goal-1', amount: 200, date: daysAgo(0).replace(/T.*/, 'T14:32:00') },
    { id: 'tx-2', goalId: 'goal-2', amount: 100, date: daysAgo(1).replace(/T.*/, 'T18:10:00') },
    { id: 'tx-3', goalId: 'goal-3', amount: 500, date: daysAgo(1).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-4', goalId: 'goal-1', amount: 300, date: daysAgo(3).replace(/T.*/, 'T09:15:00') },
    { id: 'tx-5', goalId: 'goal-2', amount: 200, date: daysAgo(5).replace(/T.*/, 'T16:45:00') },
    { id: 'tx-6', goalId: 'goal-3', amount: 1000, date: daysAgo(7).replace(/T.*/, 'T11:30:00') },
    { id: 'tx-7', goalId: 'goal-1', amount: 150, date: daysAgo(10).replace(/T.*/, 'T20:00:00') },
    { id: 'tx-8', goalId: 'goal-3', amount: 750, date: daysAgo(14).replace(/T.*/, 'T08:00:00') },
    { id: 'tx-9', goalId: 'goal-2', amount: 500, date: daysAgo(20).replace(/T.*/, 'T14:00:00') },
    { id: 'tx-10', goalId: 'goal-1', amount: 400, date: daysAgo(25).replace(/T.*/, 'T12:00:00') },
    { id: 'tx-11', goalId: 'goal-4', amount: 2500, date: daysAgo(80).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-12', goalId: 'goal-5', amount: 2000, date: daysAgo(60).replace(/T.*/, 'T15:00:00') },
    { id: 'tx-13', goalId: 'goal-1', amount: 250, date: daysAgo(30).replace(/T.*/, 'T17:30:00') },
    { id: 'tx-14', goalId: 'goal-3', amount: 2000, date: daysAgo(45).replace(/T.*/, 'T09:00:00') },
    { id: 'tx-15', goalId: 'goal-2', amount: 300, date: daysAgo(40).replace(/T.*/, 'T13:20:00') },
    { id: 'tx-16', goalId: 'goal-1', amount: 500, date: daysAgo(50).replace(/T.*/, 'T11:00:00') },
    { id: 'tx-17', goalId: 'goal-3', amount: 1500, date: daysAgo(60).replace(/T.*/, 'T16:00:00') },
    { id: 'tx-18', goalId: 'goal-2', amount: 400, date: daysAgo(55).replace(/T.*/, 'T10:30:00') },
    { id: 'tx-19', goalId: 'goal-1', amount: 1400, date: daysAgo(70).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-20', goalId: 'goal-2', amount: 900, date: daysAgo(65).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-21', goalId: 'goal-3', amount: 6750, date: daysAgo(90).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-22', goalId: 'goal-4', amount: 3500, date: daysAgo(50).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-23', goalId: 'goal-4', amount: 4000, date: daysAgo(20).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-24', goalId: 'goal-5', amount: 2500, date: daysAgo(45).replace(/T.*/, 'T10:00:00') },
    { id: 'tx-25', goalId: 'goal-5', amount: 2500, date: daysAgo(35).replace(/T.*/, 'T10:00:00') },
  ],
}
