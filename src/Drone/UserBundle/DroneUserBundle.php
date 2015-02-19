<?php

namespace Drone\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class DroneUserBundle extends Bundle
{
	public function getParent()
    {
        return 'FOSUserBundle';
    }
}
