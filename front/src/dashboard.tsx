import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Card, CardContent, Typography, TextField, Button, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale'; 
import RootLayout from "./RootLayout";
import ReportRegister from "./ReportRegister"; // Import du popup
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(new Date('2020-08-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2021-07-31'));
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false); // État pour le popup
  const [lineStats, setLineStats] = useState({
    active: 0,
    resilie: 0,
    totalPrix: 0,
    totalMoisCourant: 0,
    mois: {
      janvier: 0,
      fevrier: 0,
      mars: 0,
      avril: 0,
      mai: 0,
      juin: 0,
      juillet: 0,
      aout: 0,
      septembre: 0,
      octobre: 0,
      novembre: 0,
      decembre: 0,
    },
  }); // État pour les statistiques

  // Récupération des statistiques depuis le backend
  useEffect(() => {
    const fetchLineStats = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/lignes/stats"); // Remplace par ton URL
        setLineStats(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };

    fetchLineStats();
  }, []);

  const handleOpenReportDialog = () => {
    setIsReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
  };

  const claimsData = {
    options: {
      chart: {
        type: "line" as const,
        height: 350,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    },
    series: [
      {
        name: "Montant en : MGA",
        data: [
          lineStats.mois.janvier,
          lineStats.mois.fevrier,
          lineStats.mois.mars,
          lineStats.mois.avril,
          lineStats.mois.mai,
          lineStats.mois.juin,
          lineStats.mois.juillet,
          lineStats.mois.aout,
          lineStats.mois.septembre,
          lineStats.mois.octobre,
          lineStats.mois.novembre,
          lineStats.mois.decembre,
        ],
      },
    ],
  };


  const claimsByTypeData = {
    options: {
      labels: ["Actif", "Resillie"],
    },
    series: [lineStats.active,lineStats.resilie]
  };

  return (
    <>
      <RootLayout />
      <div className="pt-7"></div>
      <div className="p-4">
        {/* Data Filter Section */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <Grid>
              <DatePicker
                label="Date début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slots={{ textField: (props) => <TextField {...props} fullWidth /> }}
              />
            </Grid>

            <Grid>
              <DatePicker
                label="Date fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slots={{ textField: (props) => <TextField {...props} fullWidth /> }}
              />
            </Grid>
          </LocalizationProvider> */}
          <Grid item xs={12} sm={4} className="flex justify-end">
            <Button
              type="button"
              variant="outlined"
              color="error"
              fullWidth
              className="mt-5"
              onClick={handleOpenReportDialog}
              sx={{
                minWidth: '100px',
                minHeight: '30px',
                fontSize: '0.75rem',
                padding: '4px 8px',
                marginLeft: '1150px',
                marginRight: '20px',
              }}
            >
              Rédiger rapport
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={(e) => { e.preventDefault(); navigate('/Rapport') }}
              className="mt-5"
              sx={{
                minWidth: '100px',
                minHeight: '30px',
                fontSize: '0.75rem',
                padding: '4px 8px',
              }}
            >
              Consulter rapport
            </Button>
          </Grid>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Card>
              <CardContent>
                <Typography variant="h5">coût total de ce mois</Typography>
                <Typography variant="h4" className="text-green-500">
                {lineStats.totalMoisCourant.toLocaleString()}  MGA
                </Typography>
               
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent>
                <Typography variant="h5">coût total cette année</Typography>
                <Typography variant="h4" className="text-green-500">
                {lineStats.totalPrix.toLocaleString()} MGA
                </Typography>
                
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent>
                <Typography variant="h6">Couts des Forfait</Typography>
                <ApexCharts
                  options={claimsData.options}
                  series={claimsData.series}
                  type="line"
                  height={350}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent>
                <Typography variant="h6">Etat des Lignes Professionnelles</Typography>
                <ApexCharts
                  options={claimsByTypeData.options}
                  series={claimsByTypeData.series}
                  type="donut"
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Integration du popup */}
      <ReportRegister open={isReportDialogOpen} handleClose={handleCloseReportDialog} />
    </>
  );
};

export default Dashboard;
