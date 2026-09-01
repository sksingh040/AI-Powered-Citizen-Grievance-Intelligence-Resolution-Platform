import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import IncidentCluster from '../models/IncidentCluster.js';
import Department from '../models/Department.js';
import AuditLog from '../models/AuditLog.js';
import { DEPARTMENTS } from './constants.js';

let inMemoryStore = null;

export const loadSeedData = () => {
  const seedPath = path.join(process.cwd(), 'data', 'seedData.json');
  const rawData = fs.readFileSync(seedPath, 'utf8');
  return JSON.parse(rawData);
};

export const getInMemoryStore = () => {
  if (!inMemoryStore) {
    const data = loadSeedData();
    inMemoryStore = {
      users: data.users.map((u, i) => ({ ...u, _id: `usr_${i + 1}` })),
      complaints: data.complaints.map((c, i) => ({ ...c, _id: `cmp_${i + 1}`, createdAt: new Date() })),
      incidentClusters: data.incidentClusters.map((inc, i) => ({ ...inc, _id: `inc_${i + 1}`, createdAt: new Date() })),
      departments: DEPARTMENTS.map((d, i) => ({ ...d, _id: `dept_${i + 1}` })),
      auditLogs: data.auditLogs.map((a, i) => ({ ...a, _id: `aud_${i + 1}` })),
      notifications: [],
      feedbacks: []
    };
  }
  return inMemoryStore;
};

export const seedDatabase = async () => {
  try {
    const data = loadSeedData();

    // 1. Seed Departments
    await Department.deleteMany({});
    const deptDocs = DEPARTMENTS.map((d) => ({
      deptId: d.id,
      name: d.name,
      code: d.code,
      description: d.description,
      categories: d.categories,
      defaultSlaHours: d.defaultSlaHours
    }));
    await Department.insertMany(deptDocs);
    console.log(`✅ Seeded ${deptDocs.length} Departments`);

    // 2. Seed Users
    await User.deleteMany({});
    for (const u of data.users) {
      await User.create(u);
    }
    console.log(`✅ Seeded ${data.users.length} Users`);

    // 3. Seed Complaints
    await Complaint.deleteMany({});
    await Complaint.insertMany(data.complaints);
    console.log(`✅ Seeded ${data.complaints.length} Complaints`);

    // 4. Seed Incident Clusters
    await IncidentCluster.deleteMany({});
    await IncidentCluster.insertMany(data.incidentClusters);
    console.log(`✅ Seeded ${data.incidentClusters.length} Incident Clusters`);

    // 5. Seed Audit Logs
    await AuditLog.deleteMany({});
    await AuditLog.insertMany(data.auditLogs);
    console.log(`✅ Seeded ${data.auditLogs.length} Audit Logs`);

    console.log('🎉 Database seeding complete!');
  } catch (error) {
    console.warn(`Seed DB warning: ${error.message}. In-memory fallback will be used.`);
  }
};
