// "use client";

// import { useActiveStudents } from "@/hooks/use-active-students";
// import { Button } from "@/components/ui/Button"; 
// import { Spinner } from "@/components/ui/spinner"; 
// import { Badge } from "@/components/ui/badge"; 

// export default function ActiveStudentList() {
//   const { students, isLoading } = useActiveStudents();

//   // Fungsi simulasi navigasi ke halaman logbook
//   const handleViewLogbook = (mentorshipId: number) => {
//     console.log("Navigasi ke detail logbook dengan ID:", mentorshipId);
//     // Nanti ganti dengan: router.push(`/mentorship/${mentorshipId}/logbook`);
//   };

//   if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  
//   if (students.length === 0) {
//     return (
//       <div className="text-center p-8 text-brand-dark bg-white rounded-xl border border-gray-200 mt-4 animate-fade-in-down">
//         Belum ada mahasiswa aktif saat ini.
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4 animate-fade-in-down">
//       <table className="w-full text-sm text-left text-gray-600">
//         <thead className="bg-brand-white text-brand-dark font-heading font-semibold border-b border-gray-200">
//           <tr>
//             <th className="px-6 py-4 text-left whitespace-nowrap">TANGGAL DITERIMA</th>
//             <th className="px-6 py-4 text-left w-full">MAHASISWA</th>
//             <th className="px-6 py-4 text-center whitespace-nowrap">TOTAL ENTRI</th>
//             <th className="px-6 py-4 text-center whitespace-nowrap">MENUNGGU REVIEW</th>
//             <th className="px-6 py-4 text-left whitespace-nowrap">AKSI</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {students.map((student) => (
//             <tr key={student.mentorshipId} className="hover:bg-brand-white/50 transition-colors">
              
//               {/* Kolom Tanggal */}
//               <td className="px-6 py-4 text-left align-middle font-body text-gray-500 whitespace-nowrap">
//                 {student.acceptedAt 
//                   ? new Date(student.acceptedAt).toLocaleDateString("id-ID", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric"
//                     })
//                   : "-"}
//               </td>

//               {/* Kolom Mahasiswa */}
//               <td className="px-6 py-4 text-left align-middle">
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 flex-shrink-0 rounded-full bg-brand-soft text-brand-primary flex items-center justify-center font-heading font-bold text-xs">
//                     {student.studentName?.substring(0, 2).toUpperCase() || "NN"}
//                   </div>
//                   <span className="font-heading font-semibold text-brand-dark truncate">
//                     {student.studentName}
//                   </span>
//                 </div>
//               </td>

//               {/* Kolom Total Entri */}
//               <td className="px-6 py-4 text-center align-middle font-mono font-medium text-brand-dark">
//                 {student.totalEntries}
//               </td>
              
//               {/* Kolom Menunggu Review dengan Badge interaktif */}
//               <td className="px-6 py-4 text-center align-middle">
//                 {student.pendingReviews > 0 ? (
//                   <Badge status="pending" className="px-2 py-1 font-mono">
//                     {student.pendingReviews} Laporan
//                   </Badge>
//                 ) : (
//                   <span className="text-gray-400 font-body text-sm">Tidak ada</span>
//                 )}
//               </td>
              
//               {/* Kolom Aksi */}
//               <td className="px-6 py-4 text-left align-middle whitespace-nowrap">
//                 <Button 
//                   onClick={() => handleViewLogbook(student.mentorshipId)}
//                   className="bg-brand-primary hover:bg-brand-dark text-white shadow-sm h-8 px-4 text-xs font-body transition-colors"
//                 >
//                   Lihat Logbook
//                 </Button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }