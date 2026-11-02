export interface FacultyMember {
  id: string;
  name: string;
  qualification: string;
  university?: string;
  additional?: string;
  tags?: string[];
  avatar?: string;
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Ridhi Vinayak Jha',
    qualification: 'M.Com, B.Ed',
    university: 'L.N.M.U',
    tags: ['post-graduate', 'commerce', 'training'],
  },
  {
    id: 'fac-2',
    name: 'Bhavesh Kumar Mallick',
    qualification: 'B.A, D.El.Ed',
    tags: ['arts', 'training'],
  },
  {
    id: 'fac-3',
    name: 'Anish Rai',
    qualification: 'B.A, Tally, DCA',
    tags: ['arts', 'certification'],
  },
  {
    id: 'fac-4',
    name: 'Pramod Kumar Bhagat',
    qualification: 'B.A, D.El.Ed',
    tags: ['arts', 'training'],
  },
  {
    id: 'fac-5',
    name: 'Krishna Kumar Sharma',
    qualification: 'M.Sc (Botany), DCA',
    university: 'Nalanda Open University (NOU)',
    additional: 'B.Ed (Appearing)',
    tags: ['post-graduate', 'science', 'training', 'certification'],
  },
  {
    id: 'fac-6',
    name: 'Rafat Yasmin',
    qualification: 'B.Sc (Zoology)',
    university: 'L.N.M.U, Darbhanga',
    tags: ['science'],
  },
  {
    id: 'fac-7',
    name: 'Kumari Snehlata Thakur',
    qualification: 'B.A (Hindi), N.T.T (Nursery Teacher Training), KYP',
    university: 'L.N.M.U, Darbhanga',
    tags: ['arts', 'training', 'certification'],
  },
  {
    id: 'fac-8',
    name: 'Snehlata Kumari',
    qualification: 'B.Sc (Zoology), KYP',
    university: 'L.N.M.U, Darbhanga',
    tags: ['science', 'certification'],
  },
  {
    id: 'fac-9',
    name: 'Muskan Kumari',
    qualification: 'B.Sc (Zoology), KYP',
    university: 'L.N.M.U, Darbhanga',
    tags: ['science', 'certification'],
  },
  {
    id: 'fac-10',
    name: 'Priti Kumari',
    qualification: 'B.A (Political Science)',
    university: 'L.N.M.U, Darbhanga',
    tags: ['arts'],
  },
  {
    id: 'fac-11',
    name: 'Sumi Praveen',
    qualification: 'B.A (English)',
    additional: 'B.Ed (Appearing)',
    tags: ['arts', 'training'],
  },
];

export const FACULTY_FILTERS = [
  { id: 'all', label: 'All Faculty' },
  { id: 'post-graduate', label: 'Post Graduate' },
  { id: 'science', label: 'Science' },
  { id: 'arts', label: 'Arts & Commerce' },
  { id: 'training', label: 'Teacher Training' },
] as const;
