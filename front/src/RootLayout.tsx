import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

const RootLayout = () => {
    return (
        <>
            <div className="h-full w-full">
                <Grid container direction="column" style={{ height: '10vh', margin: 0, padding: 0 }}>
                    {/* Navbar */}
                    <Grid item>
                        <NavBar />
                    </Grid>

                    {/* Contenu principal */}
                    <Grid item xs style={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Outlet />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default RootLayout;
