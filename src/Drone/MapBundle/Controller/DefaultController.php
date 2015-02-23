<?php

namespace Drone\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('DroneMapBundle:Default:index.html.twig');
    }
}
