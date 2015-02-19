<?php

namespace Drone\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('DroneMapBundle:Default:index.html.twig', array('name' => $name));
    }
}
