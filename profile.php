<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Surf</title>
    <link rel="icon" type="image/svg" href="favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="static/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="static/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="static/images/favicons/favicon-16x16.png">
    <link href="https://fonts.googleapis.com/css2?family=Prata&display=swap" rel="stylesheet">
    <!-- <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500&display=swap" rel="stylesheet"> -->
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/content.css">
    <link rel="stylesheet" href="./css/nav.css">
</head>

<body>
   <?php 
        include("header.php");

        if (isset($_SESSION['uid'])) {
            require './includes/dbh.inc.php';
        
            $uid = $_SESSION['uid'];            
            $sql = "SELECT * from user_profile where uid= ?;";
            $stmt= mysqli_stmt_init($conn);
            if(!mysqli_stmt_prepare($stmt,$sql)){
                header("Location: ./index.php?sql_error1");
                // echo "sql_error1";
                exit();
            }
            else {
                mysqli_stmt_bind_param($stmt, "s", $uid);
                mysqli_stmt_execute($stmt);
                $result = $stmt->get_result();
                if($result->num_rows == 0){
                    header("Location: ./index.php?error=nouser");
                    exit();
                }
                else{
                    while($row = $result->fetch_assoc()) {
                        $name = $row['name'];
                        $jdate = $row['join_date'];
                        $address =$row['address'];
                        $phno=$row['phno'];
                        $age=$row['age'];
                        $profilepic=$row['profilepic'];
                        $about=$row['about'];
                        // echo $jdate;
                        // echo $address;
                        // echo $phno;
                        // echo $age;
                        // echo $profilepic;
                        // splitting description and images

                        // $desc_arr = preg_split("/\^/", $desc);
                        // $pic_arr = preg_split("/\^/", $pictures); 
                    }
                }
                mysqli_stmt_close($stmt);
                mysqli_close($conn);
            }
        }
        else{
            header("Location: ./index.php?error=illegal_access");
            exit();
        }
        ?>
    <!-- ****************** ALL CONTENT HERE ******************* -->

    <main>
        <section class="container">
            <article class="profile">
                <div class="card">
                    <!-- <img class="profile_pic" src="https://m.media-amazon.com/images/S/aplus-media/vc/cab6b08a-dd8f-4534-b845-e33489e91240._CR75,0,300,300_PT0_SX300__.jpg" alt=""> -->
                    <div class="profile_pic" style="background-image: url('https://m.media-amazon.com/images/S/aplus-media/vc/cab6b08a-dd8f-4534-b845-e33489e91240._CR75,0,300,300_PT0_SX300__.jpg');"></div>
                    <div class="globe_link"></div>
                    <div class="card_info">
                        <div class="uid"><?php echo htmlspecialchars($uid);?></div>
                        <h2 class="name"><?php echo $name;?></h2>
                        <div class="desc"><?php echo $about;?></div>
                        <div class="actions">
                            <button><img src="./assets/images/edit.svg" alt=""></button>
                            <!-- <button><img src="./assets/images/friends.svg" alt=""></button> -->
                            <!-- <button><img src="./assets/images/paper-plane.svg" alt=""></button> -->
                        </div>
                    </div>
                </div>
                <div class="badge-card">
                    <div class="badge" >
                        <img class="badge_pic" src="./assets/images/badge.jpg" alt="">
                        <canvas class="badge_pic" id="c"></canvs>
                    </div>
                    <!-- <div class="globe_link"></div> -->
                    <div class="card_info">
                        <h2 class="name"></h2>
                        <div class="desc">
                            <p><b>Places Travelled :</b> 12</p>
                            <p><b>Badges Earned&nbsp;&nbsp;:</b> 12</p>
                        </div>
                        <div class="actions">
                            <button><img src="./assets/images/paper-plane.svg" alt=""></button>
                        </div>
                    </div>
                </div>
                <!-- <div class="details">
                    <h1>Hi <?php echo $uid;?></h1><br>
                    <p>This is your profile page. It contains all information regarding your travel interests.</p><br>
                    
                </div>
                <canvas id="c"></canvas> -->
            </article>
            <input type="checkbox" class="flip_list">
        </section>
    </main>
   

    <?php include("footer.html")?>

    <!-- **************** SCRIPTS ***************** -->
    <script type="text/javascript" src="./js/getplaces.php"></script>
    <script src="./js/profile_earth.js" type="module"></script> 
    </body>
    <!-- <script>
        const body = document.querySelector('body');
        const loadingScreen = document.querySelector('.loading-screen');
        // loadingScreen.classList.toggle('complete');
        // setTimeout(function(){ body.classList.add('complete'); }, 2000);
        body.classList.add('complete');
        setTimeout(function(){ loadingScreen.classList.add('hide'); }, 2000);
    </script> -->
</html>